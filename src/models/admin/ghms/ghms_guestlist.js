import { model, Schema } from "mongoose";

const ghmsGuestlistSchema = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  sub_event_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'SubEvent'
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
      unique: true,
  },
  guest_add: {
    type: String,
    required: true
  },
  guest_invited: {
    type: String,
    required: true
  },
  guest_outstation: {
    type: String,
    required: true
  },
  guest_expected_nos: {
    type: Number,
    required: true
  },
  guest_invitation_type: {
    type: String,
    required: true
  },
  guest_date_of_arrival: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true});

const GHMSGuestList = model('GHMSGuestList', ghmsGuestlistSchema);

export default GHMSGuestList;