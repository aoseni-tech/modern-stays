import {Request, Response, NextFunction} from 'express';
import { BookModel, bookSchema } from '../models/bookingSchema';
import { StayModel } from '../models/staySchema';
const wrapAsync = require('../utils/wrapAsync');

let bookErrors: string[]  = [];


const check_validity = (req:Request,res:Response,next:NextFunction) =>{
    const booking = new BookModel(req.body);
    const {id} : any = req.params;
    booking.stay = id;
    booking.user = req.user?._id
    let requiredPaths = bookSchema.requiredPaths();
    let book_error = booking.validateSync();
    if(book_error) {
        bookErrors.push('form-validated');
        requiredPaths.forEach((path:string) =>{
            if(book_error?.errors[`${path}`]?.message) {
                bookErrors.push(book_error?.errors[`${path}`]?.message)
              }    
        })
       res.redirect(`/stays/${id}#booking`)
    } else {
       res.locals.booking = booking;
       res.locals.id = id;
       next()
    }
}

const check_dates = (req:Request,res:Response,next:NextFunction) =>{
    const {booking,id} = res.locals;
    const {lodgeIn,lodgeOut} = booking;
    const check_in = new Date(`${lodgeIn}`)
    let future_date = new Date(check_in.setDate(check_in.getDate() + 30))
    if(new Date(`${lodgeOut}`) > future_date) {
        bookErrors.push('form-validated','You can not book a stay for more than 30 days')
        res.redirect(`/stays/${id}#booking`)
    } else if(new Date(`${lodgeOut}`) < new Date(`${lodgeIn}`)){
        bookErrors.push('form-validated','check-out date can not come before check-in date')
        res.redirect(`/stays/${id}#booking`)
    }else {
      res.locals.lodgeIn = lodgeIn
      res.locals.lodgeOut = lodgeOut
      next();
    }
}

const getBookings = wrapAsync(async(req:Request,res:Response,next:NextFunction) =>{
    const {id} = res.locals
    const stay = await StayModel.findById(id).select('bookings')
    let bookings = BookModel.find({_id:{$in:stay?.bookings}})
    res.locals.bookings = bookings;
    next();
})

const check_availability = (req:Request,res:Response,next:NextFunction) => {
    const {id,lodgeIn,lodgeOut,bookings} = res.locals;
    const avail = (b:{lodgeIn:string,lodgeOut:string}) => 
    (new Date(`${lodgeIn}`) >= new Date(`${b.lodgeIn}`) && new Date(`${lodgeIn}`) <= new Date(`${b.lodgeOut}`)) || 
    (new Date(`${lodgeIn}`) <= new Date(`${b.lodgeIn}`) && new Date(`${lodgeOut}`) >= new Date(`${b.lodgeOut}`)) ||
    (new Date(`${lodgeOut}`) >= new Date(`${b.lodgeIn}`) && new Date(`${lodgeOut}`) <= new Date(`${b.lodgeOut}`)) ||
    (new Date(`${lodgeIn}`) < new Date() || new Date(`${lodgeOut}`) < new Date());

    if(bookings.length) {
        if(bookings.some(avail)) {
            bookErrors.push('form-validated','Dates are not avilable, please try another date')
            res.redirect(`/stays/${id}#booking`)
        } else {
            next()
        }
    } else {
      next()
    }
}

const booking_validations = [check_validity,check_dates,getBookings,check_availability]

module.exports = {booking_validations,bookErrors}