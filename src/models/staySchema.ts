import { Schema, model,Document} from 'mongoose';
import { User } from './userSchema';
import { Review } from './reviewSchema';
import{Book} from './bookingSchema';
const {cloudinary} = require('../cloudinary/config')

export interface StayDoc extends Document  {
  title: string;
  price: string;
  images:[{
    url:string;
    filename:string;
  }];
  description: string;
  location: string;
  geometry:{
    type:string,
    coordinates:[number]
  };
  host: Schema.Types.ObjectId;
  reviews?: Array<Schema.Types.ObjectId>;
  bookings?: Array<Schema.Types.ObjectId>;
  rating?: Number;
}

const staySchema = new Schema<StayDoc>({
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
        type: String,
        validate: {
            validator: function(v:any) {
              return /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(v);
            },
            message: () => `provide a valid price, price can only be numbers and must match US dollar price format`
          },
          required:[true,'price is required and must match US dollar price format'],
          trim:true
    },
    images:[{
      url:String,
      filename:String
  }],
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
  geometry: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
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

staySchema.set('toJSON', { virtuals: true });

staySchema.virtual('properties.mapText').get( function () {
  return `<strong><a href='/stays/${this._id}' target='_blank'>${this.title}</a></strong>
          <p class='muted'>${this.location}</p>
         `
});

async function calcRating (stayDoc:any) {
  let ratings:Array<number> = [0];
  const reviews:Array<Document> = await Review.find({_id: {$in:stayDoc.reviews}})
  if(reviews.length){
  reviews.forEach((review:any) => ratings.push(parseFloat(review.rating)));
  let rating = (ratings.reduce((a,b)=>a+b)/reviews.length).toFixed(2)
  stayDoc.rating = rating;
  }else {
    stayDoc.rating = '0';
  }
  await stayDoc.save()
}

staySchema.post('find', async function (docs){
  if(docs){
    docs.forEach((doc:any) => {
      calcRating (doc)
    })  
  }
})

staySchema.post('findOneAndUpdate', async function (doc){
  if(doc){
    calcRating (doc)
  }
})

staySchema.post('findOneAndDelete',async(doc:StayDoc)=>{
  if(doc){
    doc.images.forEach(async (image)=>{
      await cloudinary.uploader.destroy(image.filename);
    })
    await Promise.all([
      Review.deleteMany({_id: {$in:doc.reviews}}),
      User.findByIdAndUpdate(doc.host,{$pull:{bookings:{$in:doc.bookings},reviews:{$in:doc.reviews}}}),
      Book.deleteMany({_id: {$in:doc.bookings}})
    ]) 
  }
})

const Stay = model<StayDoc>('Stay',staySchema);
export{staySchema,Stay};