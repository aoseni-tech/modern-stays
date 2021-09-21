import {Schema, model } from 'mongoose';

interface Book {
    lodgeIn: Date;
    lodgeOut: Date;
    totalFee?: String;
  }

const bookSchema = new Schema<Book>({
    lodgeIn:  {
        type:Date,
        required:[true,'Check-in date is required to book'],
        default: Date.now
    },
    lodgeOut:  {
        type:Date,
        required:[true,'Check-out date is required to book'],
        default: Date.now
    },
    totalFee: {
        type:String,
        required: [true, 'Can not get total booking price'],
        default:'0'
    }
})

const Book = model<Book>('Book',bookSchema);

module.exports = {Book,bookSchema}