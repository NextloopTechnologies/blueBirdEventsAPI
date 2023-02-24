import { model, Schema } from "mongoose";

const eventSchema = new Schema({
    // event //
    client_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    coordinator_ids: [{
        _id: false,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }], 
    event_type: {
        type: String,
        required: true
    },
    event_title: {
        type: String,
        minlength: 3,
        required: true
    }, 
    event_descp: {
        type: String,
        minlength: 3
    }, 
    event_start_date: {
        type: Date,
        required: true,
    }, 
    event_end_date: {
        type: Date
    }, 
    event_remark: {
        type: String,
        minlength: 3
    },
    // hotel //
    hotels: [{
        _id: false,
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
                room_no: {
                    type: Number,
                    required: true
                },
                hotel_room_id: {
                    type: Schema.Types.ObjectId,
                    required: true
                },
                isBooked: {
                    type: Number,
                    required: true
                },
                guestDetails: [{
                    _id: false,
                    guest_name: String,
                    guest_mobile: String,
                    guest_email: String,
                    guest_add: String,
                    guest_date_of_arrival: Date,
                    
                }]
            }]
        }],
    }],
    // event vendor //
    event_vendors: [{
        _id: false,
        vendor_name: {
            type: String,
            required: true,
            trim: true,
            minlenght: 3
        },
        vendor_work: {
            type: String,
            required: true,
            minlenght: 3
        },
        vendor_mobile: {
            type: String,
            required: true  
        },
        reason_for_blacklist: {
            type: String,
            minlenght: 3
        },
        blacklisted: {
            type: Boolean,
            default: false
        },
        scope_of_work: {type: String, minlength: 3},
        arriving_time: String,
        total_package: String,
        paid_amount: String,
        due_amount: String,
    }],
    // event food bev //
    event_foodbev: [{
        _id: false,
        food_type: {
            type: String,
            required: true,
        },
        menu: [{
            _id: false,
            file: String,
            filename: String
        }],
        serve_date: {
            type: Date,
            required: true
        },
        serve_start_time: {
            type: String,
            required: true
        },
        serve_end_time: {
            type: String,
            required: true
        },
        plates_guaranteed: String,
        plated_added: String,
        plated_remaining: String,
        plates_used: String
    }],
    event_proddecor: [{
        _id: false,
        decor_title: {type: String, minlength: 3},
        decor_img: [{
            _id: false,
            file: String,
            filename: String
        }],
        decor_date: Date,
        expected_decor_time: String,
        decor_remark: {type: String, minlength: 3}
    }],
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

const Event = model('Event', eventSchema);

export default Event;