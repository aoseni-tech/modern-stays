import { Schema, model,Document,Model} from 'mongoose';
const {Review}: {Review:Model<{}, {}>} = require('./reviewSchema');
const {bookSchema}: {Book:Model<{}, {}>;bookSchema:Schema} = require('./bookingSchema');

interface Stay {
  title: string;
  price: string;
  image: string;
  description: string;
  location: string;
  reviews?: Array<Schema.Types.ObjectId>;
  bookings?: Array<typeof bookSchema>;
  rating?: number;
}

const schema = new Schema<Stay>({
    title: {
        type: String,
        validate: {
          validator: function(v:any) {
            return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(v);
          },
          message: () => `title is too short or contains invalid characters`
        },
        required:[true,'title is required']
    },
    price: {
        type: String,
        validate: {
            validator: function(v:any) {
              return /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(v);
            },
            message: () => `provide a valid price, price can only be numbers and must match US dollar price format`
          },
          required:[true,'price is required and must match US dollar price format']
    },
    image: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /^(ftp|http|https):\/\/[^ ']+$/.test(v);
        },
        message: () => `image url is not valid`
      },
      required:[true,'image url is required']
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
      minLength:[10,'description must contain at least 10 characters']
  },
    location: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(v);
        },
        message: () => `location is not valid, it's too short or contains invalid characters`
      },
      required:[true,'location is required']
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:'Review',
      count:true
    }
  ],
  bookings:
    {
      type: [bookSchema],
      select: false,
      default: () => ([{}])
    }
  ,
  rating: {
    type:Number,
    default:0
  }
});

schema.post('findOneAndUpdate', async function (doc){
  if(doc){
    let ratings:Array<number> = [0];
    const reviews:Array<Document> = await Review.find({_id: {$in:doc.reviews}})
    if(reviews.length){
    reviews.forEach((review:any) => ratings.push(parseFloat(review.rating)));
    let rating = (ratings.reduce((a,b)=>a+b)/reviews.length).toFixed(2)
    doc.rating = rating;
    await doc.save();
    }
  }
})

schema.post('findOneAndRemove',async(doc)=>{
  if(doc){
    await Promise.all([
      Review.deleteMany({_id: {$in:doc.reviews}})
    ]) 
  }
})

const Stay = model<Stay>('Stay',schema);
module.exports = {schema,Stay}