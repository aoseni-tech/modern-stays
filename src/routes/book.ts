import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const{check_booking_validity,Book} = require('../schemaValidations/bookSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
const{Stay} = require('../models/staySchema');

router.route('')
.get(wrapAsync(async(req:Request, res: Response)=>{
    const {id} = req.params;
    const stay = await Stay.findById(id).populate('bookings')
    let bookings = stay.bookings
    res.json(bookings)
  }))
.post(check_booking_validity,wrapAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const stay = await Stay.findById(id);
    const {booking} = res.locals
    stay.bookings.push(booking._id);
    await Promise.all([
        booking.save(),
        stay.save()
    ])
    res.redirect(`/stays/${stay._id}`)
  }))
  
router.delete('/:bookingId',wrapAsync(async(req:Request, res: Response)=>{
    const {id,bookingId} = req.params;
    await Promise.all ([
        Stay.findByIdAndUpdate(id, {$pull: {bookings: bookingId}}),
        Book.findByIdAndRemove(bookingId)
    ])
    res.redirect(`/stays/${id}`)
  }))

module.exports = router;