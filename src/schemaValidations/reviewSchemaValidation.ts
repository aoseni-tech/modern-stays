import express, {Request, Response, NextFunction} from 'express';
const{Review} = require('../models/reviewSchema');
const{Stay} = require('../models/staySchema');

let reviewErrors: string[]  = []; 

const check_review_validity = async (req:Request,res:Response,next:NextFunction) =>{
    const review = new Review(req.body);
    const {id} = req.params;
    let review_error = review.validateSync();
    if(review_error) {
        reviewErrors.push('form-validated');
        for(let data in req.body) {
          let message  = review_error.errors[`${data}`]?.message;
          reviewErrors.push(message)
       }
       res.redirect(`/stays/${id}#review-form`)
    } else {
        res.locals.review = review
        next();
    }
}


module.exports = {check_review_validity,reviewErrors,Review}