import { model, Schema } from "mongoose";

const enquirySchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    first_name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    second_name:{
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    event_date:{
        type: Date,
        required: true
    },
    venue:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    city_town:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    mobile: {
        type: String,
        required: true
    },
    ref_from: {
        type: String,
    }
},{timestamps : true})

const Enquiry = model ('Enquiry', enquirySchema);

export default Enquiry;