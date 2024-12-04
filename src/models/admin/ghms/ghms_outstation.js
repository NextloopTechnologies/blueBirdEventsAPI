import { model, Schema } from "mongoose";

const ghmsOutstationSchema = new Schema({
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
    arrival_location: { type: String, minlength: 3 },
    date_and_time: Date ,
    notes: { type: String, minlength: 3 },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const GHMSOutstation = model('GHMSOutstation', ghmsOutstationSchema);

export default GHMSOutstation;