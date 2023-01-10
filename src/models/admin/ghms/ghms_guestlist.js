import { model, Schema } from "mongoose";

const ghmsGuestlistSchema = new Schema({
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
  guest_name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3,
    maxlenght: 30
  },
  guest_mobile: {
      type: String,
      required: true
  },
  guest_email: {
      type: String,
      required: true,
      trim: true,
  },
  guest_add: {
    type: String,
    required: true
  },
  guest_outstation: {
    type: String,
    required: true
  },
  guest_invited: {
    type: String
  },
  guest_expected_nos: {
    type: Number
  },
  guest_invitation_type: {
    type: String
  },
  guest_date_of_arrival: {
    type: Date
  },
  active: {
    type: Boolean
  }
}, { timestamps: true});

const GHMSGuestList = model('GHMSGuestList', ghmsGuestlistSchema);

export default GHMSGuestList;