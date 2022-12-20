import { Schema, model } from "mongoose";

const vendorSchema = Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  sub_event_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "SubEvent"
  },
  vendor_name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3,
    maxlength: 30
  },
  vendor_work: {
    type: String,
    required: true,
  },
  vendor_mobile: {
    type: Number,
    required: true  
  },
  vendor_scope_of_work: {
    type: String,
    required: true
  },
  arriving_time: {
    type: String,
    required: true
  },
  total_package: {
    type: String,
    required: true
  },
  paid_amount: {
    type: String
  },
  due_amount: {
    type: String
  },
  reason_for_blacklist: {
    type: String
  },
  blacklisted: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
     timestamps: true
});

const Vendor = model('Vendor', vendorSchema);

export default Vendor;


