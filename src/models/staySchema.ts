import mongoose from 'mongoose';
const{Schema} = mongoose;
const StaySchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String
});
const Stay = mongoose.model('Stay',StaySchema);
module.exports = {mongoose,Schema,Stay}