import {Schema, model,Document } from 'mongoose';

export interface ReviewDoc extends Document {
    rating: Number;
    comment: String;
    user?: Schema.Types.ObjectId;
}

const reviewSchema = new Schema<ReviewDoc>({
    rating: {
        type: Number,
        max:[5,'rating can not be greater than 5'],
        min:[1,'rating must be greater than 0'],
        required:[true,'rating is required']
    },
    comment: {
        type: String,
        required:[true,'comment must contain at least 2 characters']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

const Review = model<ReviewDoc>('Review',reviewSchema);

export{Review,reviewSchema}