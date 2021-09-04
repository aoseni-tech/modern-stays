import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const{Review,check_review_validity} = require('../schemaValidations/reviewSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
const{Stay} = require('../models/staySchema');

router.post('',check_review_validity,wrapAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {review} = res.locals;
    await Promise.all ([
       review.save(),
       Stay.findByIdAndUpdate(id,{ $push: { reviews: review._id} },{new:true})
    ])
    res.redirect(`/stays/${id}`)
  }))
  
router.delete('/:reviewId',wrapAsync(async(req:Request, res: Response)=>{
  const {id,reviewId} = req.params;
  await Promise.all ([
    Stay.findByIdAndUpdate(id, {$pull: {reviews: reviewId}},{new:true}),
    Review.findByIdAndRemove(reviewId)
])
    res.redirect(`/stays/${id}`)
  }))

module.exports = router;