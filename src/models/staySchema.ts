import mongoose from 'mongoose';
const{Schema} = mongoose;
const StaySchema = new Schema({
    title: {
        type: String,
        minLength:[3, 'Title must contain 3 or more characters.']
    },
    price: {
        type: Number,
        validate: {
            validator: function(v:any) {
              return /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/.test(v);
            },
            message: props => `${props.value} is not a valid price`
          },
          required:[true,'Property price is required']
    },
    image: String,
    description: String,
    location: String
});
const Stay = mongoose.model('Stay',StaySchema);
module.exports = {mongoose,Schema,Stay}