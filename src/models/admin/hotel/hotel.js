import { model, Schema } from "mongoose";

const hotelSchema = new Schema({
    hotel_name: {
        type: String,
        minlength: 3,
        required: true
    }, 
    hotel_add: {
        type: String,
        minlength: 3,
        required: true,
    }, 
    hotel_mob: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const Hotel = model('Hotel', hotelSchema);

export default Hotel;