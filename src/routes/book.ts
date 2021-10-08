import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const{booking_validations} = require('../schemaValidations/bookSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
import { StayModel } from '../models/staySchema';
import { UserModel } from '../models/userSchema';
import {BookModel} from '../models/bookingSchema';
import {authenticatePost}  from '../middlewares/authenticatePost'

router.route('')
.get(wrapAsync(async(req:Request, res: Response)=>{
    let {id}: any = req.params;
    const bookings = await BookModel.find({stay: id})
    res.json(bookings)
  }))
.post(authenticatePost,booking_validations,wrapAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {booking} = res.locals;
    const {lodgeIn,lodgeOut} = req.body;
    let from = lodgeIn.replace(/-/g, '/');
    let to = lodgeOut.replace(/-/g, '/');
    await Promise.all([
      StayModel.findByIdAndUpdate(id, {$push: {bookings: booking._id}}),
      UserModel.findByIdAndUpdate(req.user?._id, {$push: {bookings: booking._id}}),
      booking.save()
    ]) 
    req.flash('success',`You have been booked from ${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`)
    res.redirect(`/stays/${id}`)
  }))
  
router.delete('/:bookingId',authenticatePost,wrapAsync(async(req:Request, res: Response)=>{
    const {id,bookingId} = req.params;
    const stay = await StayModel.findById(id).select('title')
    const booking = await BookModel.findById(id).select('user');
    const user = booking?.user; 
    if(`${user}` != `${req.user?._id}`) {
      req.flash('info','Permission denied: You can only cancel your bookings.')
      return res.redirect(`/stays/${id}`);
    }
    await BookModel.findByIdAndRemove(bookingId)
    req.flash('info',`Your booking for "${stay?.title}" have been canceled`)
    let referer = req.headers.referer!
    res.redirect(referer)
  }))
  
module.exports = router;