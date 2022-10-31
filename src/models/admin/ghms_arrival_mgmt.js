import { model, Schema } from "mongoose";

const ghmsArrivalMgmtSchema = new Schema({
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
    date_of_arrival: {
      type: Date,
      required: true
    },
    no_of_guest_arrived: {
      type: Number,
      required: true
    },
    mode_of_arrival: {
      type: String,
      required: true
    },
    expected_arrival_time: {
      type: String,
      required: true
    },
    arrived_at: {
        type: String,
        required: true
    },
    picked_by: {
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
    welcome_checklist: {
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

const GHMSArrivalMgmt = model('GHMSArrivalMgmt', ghmsArrivalMgmtSchema);

export default GHMSArrivalMgmt;