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
    event_service: {
        type: String,
        enum: ['SingleDayEvent','MultiDayEvent'],
        required: true
    },
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
    is_hospitality_checklist_visible: { type: Boolean, required: true, default: true },
    single_event_comments: {
        type: String,
        minlength: 3
    },
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
                    required: true,
                    ref: 'HotelRoom'
                },
                room_type_id: {
                    type: Schema.Types.ObjectId,
                    required: true
                },
                isBooked: {
                    type: Number,
                    required: true
                },
                guestDetails: [{
                    _id: Schema.Types.ObjectId,
                    guest_name: String,
                    guest_mobile: String,
                    guest_email: String,
                    guest_add: String,
                    guest_date_of_arrival: Date,
                }],
                note: String
            }]
        }],
    }],
    // event vendor //
    event_vendors: {
        vendors: [{
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
            scope_of_work: {type: String, minlength: 3},
            arriving_time: String,
            total_package: String,
            paid_amount: String,
            due_amount: String,
        }],
        // cars: [{
        //     vendor_id: {
        //         type: Schema.Types.ObjectId,
        //         required: true,
        //     },
        //     car_model: {
        //         type: String,
        //         required: true,
        //         trim: true,
        //         minlength: 3
        //     },
        //     owner_name: {
        //         type: String,
        //         required: true,
        //         trim: true,
        //         minlength: 3
        //     },
        //     car_reg: {
        //         type: String,
        //         minlength: 3,
        //         required: true
        //     },
        //     car_number: {
        //         type: String,
        //         required: true,
        //         minlength: 3
        //     },
        //     car_type: {
        //         type: String,
        //         required: true
        //     },
        //     driver_name: {
        //         type: String,
        //         required: true,
        //         trim: true,
        //         minlength: 3
        //     },
        //     driver_mobile: {
        //         type: String,
        //         required: true
        //     },
        // }]
    },
  
    event_foodbev: [{
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
        serve_start_time: String,
        serve_end_time: String,
        plates_guaranteed: String,
        plates_added: String,
        plates_remaining: String,
        plates_used: String
    }],
    event_proddecor: [{
        // _id: false,
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