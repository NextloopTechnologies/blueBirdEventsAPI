import { Schema, model } from "mongoose";

const vendorDriverSchema = Schema({
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
  driver_name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3,
    maxlength: 30
  },
  driver_mobile: {
      type: Number,
      required: true
  },
  driver_email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
     timestamps: true
});

const VendorDriver = model('VendorDriver', vendorDriverSchema);

export default VendorDriver;


