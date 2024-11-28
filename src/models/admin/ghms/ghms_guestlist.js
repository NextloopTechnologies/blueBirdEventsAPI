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
    minlenght: 3
  },
  guest_mobile: {
    type: String,
    required: true
  },
  // guest_email: {
  //   type: String,
  //   trim: true,
  // },
  // guest_add: {
  //   type: String,
  //   minlength: 3
  // },
  guest_outstation: {
    type: String,
    enum: ['Local','Outstation'],
    required: true
  },
  // guest_invited: {
  //   type: String,
  //   enum: ['Individual','Family'],
  // },
  // guest_expected_nos: {
  //   type: Number
  // },
  // guest_invitation_type: {
  //   type: String,
  //   enum: ['Courier','Personally','Digitally']
  // },
  // guest_date_of_arrival: {
  //   type: Date
  // },
  digital_invitation: {
    type: Boolean,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    required: true,
    minlenght: 3
  },
  active: {
    type: Boolean
  }
}, { timestamps: true});

const GHMSGuestList = model('GHMSGuestList', ghmsGuestlistSchema);

export default GHMSGuestList;