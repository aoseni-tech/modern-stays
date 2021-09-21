import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
const{booking_validations} = require('../schemaValidations/bookSchemaValidation');
const wrapAsync = require('../utils/wrapAsync');
const{Stay} = require('../models/staySchema');

router.route('')
.get(wrapAsync(async(req:Request, res: Response)=>{
    const {id} = req.params;
    const stay = await Stay.findById(id).select('bookings')
    const {bookings}: {bookings:Array<Document>} = stay
    res.json(bookings)
  }))
.post(booking_validations,wrapAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const stay = await Stay.findById(id).select('bookings');
    const {booking} = res.locals
    stay.bookings.push(booking);
    await stay.save()
    res.redirect(`/stays/${stay._id}`)
  }))
  
router.delete('/:bookingId',wrapAsync(async(req:Request, res: Response)=>{
    const {id,bookingId} = req.params;
    const stay = await Stay.findById(id).select('bookings')
    stay.bookings.id(bookingId).remove();
    await stay.save()
    res.redirect(`/stays/${id}`)
  }))
  
module.exports = router;