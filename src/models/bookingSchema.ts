import {Schema, model } from 'mongoose';

interface Book {
    lodgeIn: Date;
    lodgeOut: Date;
    totalFee?: String;
  }

let min_date = new Date(new Date().setDate(new Date().getDate() - 1))
let current_date = new Date();

const bookSchema = new Schema<Book>({
    lodgeIn:  {
        type:Date,
        validate: {
            validator: function(v:any) {
              return new Date(v) > min_date;
            },
            message: () => `lodge In date must be on or  after "${current_date.toDateString()}"`
          },
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