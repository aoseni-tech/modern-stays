import { Request, Response, NextFunction } from "express";
import { User, UserDoc } from "../models/userSchema";
import { Stay, StayDoc } from "../models/staySchema";
import { Book } from "../models/bookingSchema";
import passport from "passport";
const { cloudinary } = require("../cloudinary/config");

module.exports.renderSignUpForm = (req: Request, res: Response) => {
  const title = "Register";
  const page = "register";
  res.render("pages/register", { title, page });
};

module.exports.registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    User.register(user, password, (err, user: UserDoc) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/register");
      }

      passport.authenticate("local")(req, res, function () {
        req.flash("success", `Welcome to Modern Stays, ${username}`);
        let redirectUrl = req.session.returnTo?.replace("/bookings", "") || "/";
        res.redirect(redirectUrl);
      });
    });
  } catch (e: any) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginPage = (req: Request, res: Response) => {
  const title = "LogIn";
  const page = "Login";
  res.render("pages/login", { title, page });
};

module.exports.login = (req: Request, res: Response) => {
  let username = req.user?.username;
  req.flash("success", `Welcome back,  ${username}`);
  let redirectUrl = req.session.returnTo?.replace("/bookings", "") || "/";
  res.redirect(redirectUrl);
};

module.exports.logout = (req: Request, res: Response) => {
  req.logout();
  req.flash("info", "You have been logged out");
  res.redirect("/");
};

module.exports.profilePage = async (req: Request, res: Response) => {
  let title = `my profile-@${req.user?.username}`;
  let myStays = req.user?.stays;
  let myBookings = req.user?.bookings;
  let stays = await Stay.find({ _id: { $in: myStays } }).select(
    "title location"
  );
  let bookings = await Book.find({ _id: { $in: myBookings } })
    .select("lodgeIn lodgeOut")
    .populate("stay", "title location");
  let page = "profile";
  res.render("pages/user", { title, page, stays, bookings });
};

module.exports.deleteUserAccount = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (userId != req.user?._id) {
    req.logOut();
    req.flash(
      "info",
      `Permission denied: You can not delete another user's account`
    );
    return res.redirect("/");
  }

  let user = await User.findById(userId);

  const docs = await Stay.find({ _id: { $in: user?.stays } });
  docs.forEach((doc) => {
    doc.images.forEach(async (image) => {
      await cloudinary.uploader.destroy(image.filename);
    });
  });

  if (user) await User.findByIdAndDelete(userId);
  req.flash("info", "Your account have been deleted");
  res.redirect("/");
};
