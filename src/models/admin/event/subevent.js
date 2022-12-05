import { model, Schema } from "mongoose";

const subEventSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }, 
    hotel_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Hotel'
    },
    hotel_rooms_required:[{
        _id: false,
        floor_no: Number,
        room_nos: [{
            _id: false,
            type: String
        }]
    }], 
    client_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    subevent_date: {
        type: Date,
        required: true,
    }, 
    subevent_title: {
        type: String,
        required: true,
        minlength: 3
    },
    subevent_descp: {
        type: String,
        required: true
    },
    prod_decor_note: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const SubEvent = model('SubEvent', subEventSchema);

export default SubEvent;