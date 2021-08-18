import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
const{Schema} = mongoose;

const reviewSchema = new Schema({
    comment:  {
        type:String,
        minLength:[2,'comment must contain at least 2 characters'],
        required:[true,'comment is required to submit reviews']
    },
    rating: {
        type:Number,
        required:[true,'rating is required']
    }
})

const Review = mongoose.model('Review',reviewSchema);

let reviewErrors: string[]  = []; 

let tester:string = "hey"

const check_review_validity = (req:Request,res:Response,next:NextFunction) =>{
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
        next();
        res.locals.review = review
    }
}

module.exports = {Review,check_review_validity,reviewErrors,tester}