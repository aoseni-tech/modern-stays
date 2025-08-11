import { Request, Response } from "express";
import { Schema } from "mongoose";
import { Stay } from "../models/staySchema";
import { User } from "../models/userSchema";
import { Book, BookDoc } from "../models/bookingSchema";
const { reviewErrors } = require("../schemaValidations/reviewSchemaValidation");
const { bookErrors } = require("../schemaValidations/bookSchemaValidation");
const { cloudinary } = require("../cloudinary/config");

module.exports.getStays = async (req: Request, res: Response) => {
  let { query, sorts, location, page_offset, start, end } = res.locals;

  const docs = await Book.find({
    $or: [
      { $and: [{ lodgeIn: { $lte: start } }, { lodgeOut: { $gte: start } }] },
      { $and: [{ lodgeIn: { $lte: end } }, { lodgeOut: { $gte: end } }] },
      { $and: [{ lodgeIn: { $gte: start } }, { lodgeOut: { $lte: end } }] },
    ],
  });

  let bookingsID: Array<Schema.Types.ObjectId> = [];
  docs.forEach((doc: BookDoc) => {
    bookingsID.push(doc._id as Schema.Types.ObjectId);
  });

  let stayCount = await Stay.find(query)
    .where("bookings")
    .nin(bookingsID)
    .countDocuments();

  if (page_offset < 0 || typeof parseFloat(page_offset) !== "number") {
    page_offset = 0;
  } else if (page_offset > Math.floor(stayCount / 5)) {
    page_offset = Math.floor(stayCount / 5);
  }

  let stays = await Stay.find(query)
    .sort({ _id: sorts })
    .where("bookings")
    .nin(bookingsID)
    .skip(parseFloat(page_offset) * 5)
    .limit(5);

  const title = `Modern Stays.${location || "All"}`;
  const page = "search";
  res.render("pages/searchResults", {
    title,
    stays,
    page,
    stayCount,
    page_offset,
  });
};

//**
// API TO GET ALL  STAYS INFO
module.exports.staysData = async (req: Request, res: Response) => {
  let stays = await Stay.find({});
  res.json({ features: stays, mapToken: process.env.MAPBOX_TOKEN });
};
// API TO GET A SINGLE STAY INFO
module.exports.stayInfo = async (req: Request, res: Response) => {
  let { id } = req.params;
  let stay = await Stay.findById(id);
  res.json({ features: stay, mapToken: process.env.MAPBOX_TOKEN });
};

//**

module.exports.createNewStay = async (req: Request, res: Response) => {
  const { stay } = res.locals;

  await Promise.all([
    User.findByIdAndUpdate(stay.host, { $push: { stays: stay._id } }),
    stay.save(),
  ]);

  req.flash(
    "success",
    `Successfully added to the listings:  ${stay.title}, ${stay.location}.`
  );
  res.redirect(`/stays/${stay._id}/edit/images`);
};

module.exports.renderNewStayForm = (req: Request, res: Response) => {
  const title = "Add new.MS";
  const page = "new";
  res.render("pages/new", { title, page });
};

module.exports.renderEditStayForm = async (req: Request, res: Response) => {
  const stay = await Stay.findById(req.params.id);
  const title = stay?.title;
  const page = "update";
  res.render("pages/update", { title: `Update ${title}.MS`, stay, page });
};

module.exports.editStay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { geometry } = res.locals;
  req.body.geometry = geometry;
  const update = req.body;
  const stay = await Stay.findByIdAndUpdate(id, update, { new: true });
  let { title, location } = stay!;

  req.flash("success", `Updated your listing:  ${title}, ${location}.`);
  res.redirect(`/stays/${id}`);
};

module.exports.renderEditImageForm = async (req: Request, res: Response) => {
  const stay = await Stay.findById(req.params.id);
  const title = stay?.title || 'Edit images.MS';
  const page = "editImage";
  res.render("pages/editImages", { title, stay, page });
};

module.exports.addImages = async (req: Request, res: Response) => {
  const { deleteImages } = req.body;
  const stay = await Stay.findById(req.params.id);
  if (deleteImages) {
    if (Array.isArray(deleteImages)) {
      deleteImages?.forEach(async (image: string) => {
        await cloudinary.uploader.destroy(image);
      });
      await stay?.updateOne({
        $pull: { images: { filename: { $in: deleteImages } } },
      });
    } else {
      await cloudinary.uploader.destroy(deleteImages);
      await stay?.updateOne({ $pull: { images: { filename: deleteImages } } });
    }
  }

  if (req.files) {
    req.files.forEach((file: any) => {
      let imageData = { url: file.path, filename: file.filename };
      stay?.images.push(imageData);
    });
    await stay?.save();
  }
  res.redirect(`/stays/${stay?._id}`);
};

module.exports.showStay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stay = await Stay.findById(id).populate({
    path: "reviews",
    options: { sort: { _id: "desc" } },
    populate: { path: "user", select: "username" },
  });
  let { reviews, title, bookings } = stay!;
  let page = "show";
  let review_formStatus = "";
  if (reviewErrors.length) review_formStatus = "form-validated";
  res.render("pages/show", {
    title: title + ".MS",
    stay,
    page,
    reviews,
    reviewErrors,
    bookErrors,
    bookings,
    review_formStatus,
  });
  bookErrors.length = 0;
  reviewErrors.length = 0;
};

module.exports.deleteStay = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stay = await Stay.findOneAndDelete({ _id: id });
  const user = await User.findById(stay?.host);
  let { stays } = user!;
  let i = stays?.indexOf(stay?._id as Schema.Types.ObjectId)!;
  if (i > -1) {
    stays?.splice(i, 1);
  }
  await user?.save();
  let { title, location } = stay!;
  req.flash(
    "info",
    `${title}, ${location}. have been removed from your listings`
  );
  res.redirect(`/`);
};
