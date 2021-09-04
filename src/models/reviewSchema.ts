import mongoose from 'mongoose';
const{Schema} = mongoose;

const reviewSchema = new Schema({
    comment:  {
        type:String,
        minLength:[2,'comment must contain at least 2 characters'],
        required:[true,'comment is required to submit reviews']
    },
    rating: {
        type:Number,
        required:[true,'rating is required']
    }
})

const Review = mongoose.model('Review',reviewSchema);

module.exports = {Review}