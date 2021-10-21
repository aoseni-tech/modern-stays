import {Schema, model,Model,Document} from 'mongoose';
import { User } from './userSchema';
import { Stay } from './staySchema';

export interface BookDoc extends Document {
    lodgeIn: Date;
    lodgeOut: Date;
    totalFee: String;
    user: Schema.Types.ObjectId;
    stay: Schema.Types.ObjectId;
}

const bookSchema = new Schema<BookDoc>({
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
        User.findByIdAndUpdate(doc.user,{$pull:{bookings:doc._id}}),
        Stay.findByIdAndUpdate(doc.stay,{$pull:{bookings:doc._id}})
      ]) 
    }
  })

const Book = model<BookDoc>('Book',bookSchema);
export{Book,bookSchema};