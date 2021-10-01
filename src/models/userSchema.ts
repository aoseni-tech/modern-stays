import { Schema, model,Document,Model} from 'mongoose';
const passportLocalMongoose = require('passport-local-mongoose');
// const {Review}: {Review:typeof model} = require('./reviewSchema');
// const {Book}: {Book:typeof model} = require('./bookingSchema');

interface User {
  email: string;
  // reviews?: Array<Schema.Types.ObjectId>;
  // bookings?: Array<Schema.Types.ObjectId>;
}

const schema = new Schema<User>({
    email: { 
      type: String,
      validate: {
        validator: function(v:any) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: () => `provide a valid email address`
      },
      required: [true,'please provide a valid email address'] 
    }
  });

schema.plugin(passportLocalMongoose);

const User = model<User>('User',schema);
module.exports = {schema,User}