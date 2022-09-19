import { model, Schema } from "mongoose";

const eventPhotoSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }, 
    event_date: {
        type: Date,
        required: true,
    }, 
    ep_title: {
        type: String,
        required: true,
        minlength: 3
    },
    ep_descp: {
        type: String,
        required: true
    },
    ep_img: [{
        fileId: String,
        url: String
    }],
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const EventPhoto = model('EventPhoto', eventPhotoSchema);

export default EventPhoto;