import { model, Schema } from "mongoose";

const eventSchema = new Schema({
    event_title: {
        type: String,
        required: true
    }, 
    event_descp: {
        type: String,
        required: true,
    }, 
    event_img: [{
        fileId: String,
        url: String
    }],
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const Event = model('Event', eventSchema);

export default Event;