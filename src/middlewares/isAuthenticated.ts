import {Request, Response, NextFunction} from 'express';
const isAuthenticated = (req:Request,res:Response,next:NextFunction) =>{
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('info', 'You must be signed in to continue');
        return res.redirect('/login');
    }
    next();
}

export{isAuthenticated}