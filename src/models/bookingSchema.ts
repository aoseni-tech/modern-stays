import {Schema, model } from 'mongoose';
interface Book {
    lodgeIn: Date;
    lodgeOut: Date;
    totalFee?: string;
  }

const schema = new Schema<Book>({
    lodgeIn:  {
        type:Date,
        required:[true,'Check-in date is required to book']
    },
    lodgeOut:  {
        type:Date,
        required:[true,'Check-out date is required to book']
    },
    totalFee: {
        type:String,
        required: [true, 'Can not get total booking price']
    }
})

const Book = model<Book>('Book',schema);

module.exports = {Book}