import { model, Schema } from "mongoose";

const ghmsDepartureMgmtSchema = new Schema({
    client_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    event_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Event'
    },
    guest_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'GHMSGuestList'
    },
    date_of_departure: {
      type: Date,
      required: true
    },
    // no_of_guest_arrived: {
    //   type: Number,
    //   required: true
    // },
    mode_of_departure: {
      type: String,
      required: true
    },
    departure_time: {
        type: String,
        required: true
    },
    car_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'VendorCar'
    },
    return_checklist: String,
    special_note: String,
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true });

const GHMSDepartureMgmt = model('GHMSDepartureMgmt', ghmsDepartureMgmtSchema);

export default GHMSDepartureMgmt;