import {Schema, model,Model,Document} from 'mongoose';
import { UserModel } from './userSchema';
import { StayModel } from './staySchema';

export interface Book extends Document {
    lodgeIn: Date;
    lodgeOut: Date;
    totalFee: String;
    user: Schema.Types.ObjectId;
    stay: Schema.Types.ObjectId;
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
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    stay:{
        type: Schema.Types.ObjectId,
        ref:'Stay',
        required:[true,'You can not book without a stay']
    }
})

bookSchema.post('findOneAndRemove',async(doc)=>{
    if(doc){
      await Promise.all([
        UserModel.findByIdAndUpdate(doc.user,{$pull:{bookings:doc._id}}),
        StayModel.findByIdAndUpdate(doc.stay,{$pull:{bookings:doc._id}})
      ]) 
    }
  })

const BookModel = model<Book>('Book',bookSchema);
export{BookModel,bookSchema};