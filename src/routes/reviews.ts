import express from 'express';
const router = express.Router({mergeParams:true});
const{validateReview} = require('../schemaValidations/reviewSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
import {authenticatePost}  from '../middlewares/authenticatePost'
const reviews = require('../controllers/reviews');

router.post('',authenticatePost,validateReview,wrapAsync(reviews.addReview))
  
router.delete('/:reviewId',authenticatePost,wrapAsync(reviews.deleteReview))

module.exports = router;