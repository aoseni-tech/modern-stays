import { Schema, model,Document, PassportLocalDocument,PassportLocalSchema, PassportLocalModel} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { StayModel } from './staySchema';
import { ReviewModel } from './reviewSchema';
import{BookModel} from './bookingSchema';

export interface User extends PassportLocalDocument {
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
  })  as PassportLocalSchema;

  schema.plugin(passportLocalMongoose);

interface UserModel<T extends Document> extends PassportLocalModel<T> {}

schema.post('findOneAndRemove',async(doc:User)=>{
  if(doc){
    await Promise.all([
      StayModel.updateMany({reviews:{$in:doc.reviews}},{$pull:{reviews:{$in:doc.reviews}}}),
      StayModel.updateMany({bookings:{$in:doc.bookings}},{$pull:{bookings:{$in:doc.bookings}}}),
      ReviewModel.deleteMany({_id: {$in:doc.reviews}}),
      StayModel.deleteMany({_id: {$in:doc.stays}}),
      BookModel.deleteMany({_id: {$in:doc.bookings}})
    ]) 
  }
})

let UserModel: UserModel<User> = model<User>('User',schema);

export{schema,UserModel};