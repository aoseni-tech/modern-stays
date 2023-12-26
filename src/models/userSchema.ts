import { Schema, model,Document, PassportLocalDocument,PassportLocalSchema, PassportLocalModel} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { Stay } from './staySchema';
import { Review } from './reviewSchema';
import{Book} from './bookingSchema';

export interface UserDoc extends PassportLocalDocument {
  username:string;
  email: string;
  stays?: Array<Schema.Types.ObjectId>;
  reviews?: Array<Schema.Types.ObjectId>;
  bookings?: Array<Schema.Types.ObjectId>;
}


const schema = new Schema({
    email: { 
      type: String,
      validate: {
        validator: function(v:any) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: () => `provide a valid email address`
      },
      required: [true,'please provide a valid email address'] 
    },
    stays: [
      {
        type:Schema.Types.ObjectId,
        ref:'Stay'
      }
    ],
    reviews: [
      {
        type:Schema.Types.ObjectId,
        ref:'Review'
      }
    ],
    bookings: [
      {
        type:Schema.Types.ObjectId,
        ref:'Book'
      }
    ]
    // @ts-ignore
  })  as PassportLocalSchema;

  schema.plugin(passportLocalMongoose);

interface UserModel<T extends Document> extends PassportLocalModel<T> {}

schema.post('findOneAndDelete',async(doc:UserDoc)=>{
  if(doc){
    await Promise.all([
      Stay.updateMany({reviews:{$in:doc.reviews}},{$pull:{reviews:{$in:doc.reviews}}}),
      Stay.updateMany({bookings:{$in:doc.bookings}},{$pull:{bookings:{$in:doc.bookings}}}),
      Review.deleteMany({_id: {$in:doc.reviews}}),
      Stay.deleteMany({_id: {$in:doc.stays}}),
      Book.deleteMany({_id: {$in:doc.bookings}})
    ]) 
  }
})

let User: UserModel<UserDoc> = model<UserDoc>('User',schema);

export{schema,User};