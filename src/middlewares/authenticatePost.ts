import {Request, Response, NextFunction} from 'express';
const authenticatePost = (req:Request,res:Response,next:NextFunction) =>{ 
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.headers?.referer || `/`
        req.flash('info', 'You must be signed in  to continue');
        return res.redirect('/login');
    }
    next();
}

export{authenticatePost}