import { Schema, model,Document} from 'mongoose';
import { UserModel } from './userSchema';
import { ReviewModel } from './reviewSchema';
import{BookModel} from './bookingSchema';

export interface Stay extends Document  {
  title: string;
  price: String;
  image: string;
  description: string;
  location: string;
  host: Schema.Types.ObjectId;
  reviews?: Array<Schema.Types.ObjectId>;
  bookings?: Array<Schema.Types.ObjectId>;
  rating?: Number;
}

const schema = new Schema<Stay>({
    host: {
      type: Schema.Types.ObjectId,
      ref : 'User',
      required:[true,'stay can not be added if you are not registered/logged in']
    },
    title: {
        type: String,
        validate: {
          validator: function(v:any) {
            return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(v);
          },
          message: () => `title is too short or contains invalid characters`
        },
        required:[true,'title is required'],
        trim:true
    },
    price: {
        type: Number,
        validate: {
            validator: function(v:any) {
              return /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(v);
            },
            message: () => `provide a valid price, price can only be numbers and must match US dollar price format`
          },
          required:[true,'price is required and must match US dollar price format'],
          trim:true
    },
    image: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /^(ftp|http|https):\/\/[^ ']+$/.test(v);
        },
        message: () => `image url is not valid`
      },
      required:[true,'image url is required'],
      trim:true
  },
    description: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /[\s\S]{10,}/.test(v);
        },
        message: () => `description must contain at least 10 characters`
      },
      required:[true,'description is required'],
      minLength:[10,'description must contain at least 10 characters'],
      trim:true
  },
    location: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(v);
        },
        message: () => `location is not valid, it's too short or contains invalid characters`
      },
      required:[true,'location is required'],
      trim:true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:'Review'
    }
  ],
  bookings:[
    {
      type: Schema.Types.ObjectId,
      ref:'Book'
    }
  ],
  rating: {
    type:Number,
    default:0
  }
});

async function calcRating (stayDoc:any) {
  let ratings:Array<number> = [0];
  const reviews:Array<Document> = await ReviewModel.find({_id: {$in:stayDoc.reviews}})
  if(reviews.length){
  reviews.forEach((review:any) => ratings.push(parseFloat(review.rating)));
  let rating = (ratings.reduce((a,b)=>a+b)/reviews.length).toFixed(2)
  stayDoc.rating = rating;
  return await stayDoc.save();
  }
  stayDoc.rating = '0';
  await stayDoc.save()
}

schema.post('findOneAndUpdate', async function (doc){
  if(doc){
    calcRating (doc)
  }
})

schema.post('find', async function (docs){
  if(docs){
    docs.forEach((doc:any) => {
      calcRating (doc)
    })  
  }
})

schema.post('findOneAndRemove',async(doc:Stay)=>{
  if(doc){
    await Promise.all([
      ReviewModel.deleteMany({_id: {$in:doc.reviews}}),
      UserModel.findByIdAndUpdate(doc.host,{$pull:{bookings:{$in:doc.bookings},reviews:{$in:doc.reviews}}}),
      BookModel.deleteMany({_id: {$in:doc.bookings}})
    ]) 
  }
})

const StayModel = model<Stay>('Stay',schema);
export{schema,StayModel};