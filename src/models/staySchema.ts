import mongoose from 'mongoose';
const{Schema} = mongoose;
const {Review} = require('./review');
const StaySchema = new Schema({
    title: {
        type: String,
        validate: {
          validator: function(v:any) {
            return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(v);
          },
          message: props => `title is too short or contains invalid characters`
        },
        required:[true,'title is required']
    },
    price: {
        type: String,
        validate: {
            validator: function(v:any) {
              return /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(v);
            },
            message: props => `provide a valid price, price can only be numbers and must match US dollar price format`
          },
          required:[true,'price is required and must match US dollar price format']
    },
    image: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /^(ftp|http|https):\/\/[^ ']+$/.test(v);
        },
        message: props => `image url is not valid`
      },
      required:[true,'image url is required']
  },
    description: {
      type: String,
      validate: {
        validator: function(v:any) {
          return /^[a-zA-Z0-9\s,?.!'-]{10,}$/.test(v);
        },
        message: props => `description must contain at least 10 characters without special characters except " . , ' ? - "`
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
        message: props => `location is not valid, it's too short or contains invalid characters`
      },
      required:[true,'location is required']
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:'Review',
      count:true
    }
  ]
});

StaySchema.post('findOneAndRemove',async(doc)=>{
  if(doc){
    await Review.deleteMany({
      _id: {
        $in:doc.reviews
      }
    })
  }
})

// virtual method for staySchema 
StaySchema.virtual('averageRating').get(function() {
  let ratings:Array<any> = [];
  this.reviews.forEach((review:any) => ratings.push(review.rating));
  return (ratings.reduce((a,b)=>a+b)/ratings.length).toFixed(2);
});

const Stay = mongoose.model('Stay',StaySchema);
module.exports = {mongoose,Schema,Stay,StaySchema}