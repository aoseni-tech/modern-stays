import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const{validateReview} = require('../schemaValidations/reviewSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
import { StayModel } from '../models/staySchema';
import { ReviewModel } from '../models/reviewSchema';
import { UserModel } from '../models/userSchema';
import {authenticatePost}  from '../middlewares/authenticatePost'

router.post('',authenticatePost,validateReview,wrapAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {review} = res.locals;
    await Promise.all ([
       review.save(),
       StayModel.findByIdAndUpdate(id,{ $push: { reviews: review._id} },{new:true}),
       UserModel.findByIdAndUpdate(req.user?._id,{ $push: { reviews: review._id} },{new:true})
    ])
    res.redirect(`/stays/${id}`)
  }))
  
router.delete('/:reviewId',authenticatePost,wrapAsync(async(req:Request, res: Response)=>{
  const {id,reviewId} = req.params;
  let review = await ReviewModel.findById(reviewId).select('user');
  let {user,_id} = review!;
  if(`${user}` != `${req.user?._id}`) {
    req.flash('info','Permission denied: You can only delete comments you posted.')
    return res.redirect(`/stays/${id}`);
  }
  await Promise.all ([
    ReviewModel.findByIdAndRemove(_id),
    StayModel.findByIdAndUpdate(id, {$pull: {reviews: _id}},{new:true}),
    UserModel.findByIdAndUpdate(user, {$pull: {reviews: _id}},{new:true})
])
    res.redirect(`/stays/${id}`)
  }))

module.exports = router;