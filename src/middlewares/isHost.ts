import {Request, Response, NextFunction} from 'express';
import { Stay } from '../models/staySchema';
const isHost = async (req:Request,res:Response,next:NextFunction) =>{
     const {id} = req.params;
     const stay = await Stay.findById(id).select('host');
     if(`${stay?.host}` != `${req.user?._id}`) {
         req.session.returnTo = req.headers?.referer || `/`
         req.flash('info','You do not have the permission to do this')
         return res.redirect(`/stays/${id}`);
     }     
     next()
}

export{isHost}