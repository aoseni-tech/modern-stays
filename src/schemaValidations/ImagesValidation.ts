import {Request, Response, NextFunction} from 'express';
import { FileFilterCallback } from 'multer';
const multer  = require('multer');
const {storage} = require('../cloudinary/config');
const limits = { fileSize: 1200000 }

const upload = multer({
  storage,
  fileFilter: function (req:Request, file:File, cb:FileFilterCallback) {
      return cb(null, true)
  },
  limits
}).array('images',3);

const uploadCb = function (req:Request, res:Response,next:NextFunction) {
  upload(req, res, function (err:Error) {
    let {id} = req.params;
    if (err) {
      let message = err?.message;
      req.flash('info',`${message} : maximum of 3 images allowed not exceeding 1mb each`);
      return res.redirect(`/stays/${id}`)
    } 
    next()    
  })
  
}

module.exports = {uploadCb}