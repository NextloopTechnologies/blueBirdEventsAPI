import { model, Schema } from "mongoose";

const ghmsDepartureMgmtSchema = new Schema({
    sub_event_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SubEvent'
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
    no_of_guest_arrived: {
      type: Number,
      required: true
    },
    mode_of_departure: {
      type: String,
      required: true
    },
    departure_time: {
        type: String,
        required: true
    },
    dropped_by: {
      type: String,
      required: true
    },
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    car_id: {
      type: Schema.Types.ObjectId,
      ref: 'VendorCar'
    },
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: 'VendorDriver'
    },
    return_checklist: {
      type: String,
      required: true
    },
    special_note: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const GHMSDepartureMgmt = model('GHMSDepartureMgmt', ghmsDepartureMgmtSchema);

export default GHMSDepartureMgmt;