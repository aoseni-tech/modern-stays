import {Request, Response} from 'express';
import { Stay } from '../models/staySchema';
import { Review } from '../models/reviewSchema';
import { User } from '../models/userSchema';

module.exports.addReview = async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {review} = res.locals;
    await Promise.all ([
       review.save(),
       Stay.findByIdAndUpdate(id,{ $push: { reviews: review._id} },{new:true}),
       User.findByIdAndUpdate(req.user?._id,{ $push: { reviews: review._id} },{new:true})
    ])
    res.redirect(`/stays/${id}#reviews`)
}

module.exports.deleteReview = async(req:Request, res: Response)=>{
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId).select('user');
    let {user,_id} = review!;
    if(`${user}` != `${req.user?._id}`) {
      req.flash('info','Permission denied: You can only delete comments you posted.')
      return res.redirect(`/stays/${id}`);
    }
    await Promise.all ([
      Review.findByIdAndDelete(_id),
      Stay.findByIdAndUpdate(id, {$pull: {reviews: _id}},{new:true}),
      User.findByIdAndUpdate(user, {$pull: {reviews: _id}},{new:true})
  ])
      res.redirect(`/stays/${id}`)
}