import express, {Request, Response, NextFunction} from 'express';
const{Book} = require('../models/bookingSchema');

let bookErrors: string[]  = []; 

const check_booking_validity = (req:Request,res:Response,next:NextFunction) =>{
    const booking = new Book(req.body);
    const {id} = req.params;
    let book_error = booking.validateSync();
    if(book_error) {
        bookErrors.push('form-validated');
        for(let data in req.body) {
          let message  = book_error.errors[`${data}`]?.message;
          bookErrors.push(message)
       }
       res.redirect(`/stays/${id}#booking`)
    } else {
        next();
        res.locals.booking = booking
    }
}


module.exports = {check_booking_validity,bookErrors,Book}