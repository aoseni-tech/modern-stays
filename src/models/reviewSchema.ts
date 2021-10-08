import {Schema, model,Document } from 'mongoose';
import { StayModel } from './staySchema';
import { UserModel } from './userSchema';
import{BookModel} from './bookingSchema';

export interface Review extends Document {
    rating: String;
    comment: String;
    user?: Schema.Types.ObjectId;
}

const reviewSchema = new Schema<Review>({
    rating: {
        type: String,
        required:[true,'rating is required']
    },
    comment: {
        type: String,
        validate: {
            validator: function(v:any) {
              return /^[a-zA-Z0-9\s,.'-]{2,}$/.test(v);
            },
            message: () => `comment must contain at least 2 characters`
          },
          required:[true,'comment must contain at least 2 characters']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

const ReviewModel = model<Review>('Review',reviewSchema);

export{ReviewModel,reviewSchema}