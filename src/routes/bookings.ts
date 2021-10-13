import express from 'express';
const router = express.Router({mergeParams:true});
const{booking_validations} = require('../schemaValidations/bookSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
import {authenticatePost}  from '../middlewares/authenticatePost'
const bookings = require('../controllers/bookings');

router.route('')
.get(wrapAsync(bookings.getStayBookings))
.post(authenticatePost,booking_validations,wrapAsync(bookings.bookStay));
  
router.delete('/:bookingId',authenticatePost,wrapAsync(bookings.cancelBooking));
  
module.exports = router;