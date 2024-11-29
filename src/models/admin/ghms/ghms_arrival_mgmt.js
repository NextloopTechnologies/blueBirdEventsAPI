import { model, Schema } from "mongoose";

const ghmsArrivalMgmtSchema = new Schema({
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
    date_of_arrival: Date,
    arrived_at: String,
    arrival_location: String,
    conveyance_through: { type: String, enum: ['Self', 'RentalCar', 'PrivateCar']},
    details: String,
    // no_of_guest_arrived: {
    //   type: Number,
    //   required: true
    // },
    // mode_of_arrival: {
    //   type: String,
    //   required: true
    // },
    // expected_arrival_time: {
    //   type: String,
    //   required: true
    // },
    // car_id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'VendorCar'
    // },
    // welcome_checklist: String,
    // special_note: String,
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true });

const GHMSArrivalMgmt = model('GHMSArrivalMgmt', ghmsArrivalMgmtSchema);

export default GHMSArrivalMgmt;