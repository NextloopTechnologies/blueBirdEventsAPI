import { Schema, model } from "mongoose";

const vendorSchema = Schema({
  vendor_name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3
  },
  vendor_work: {
    type: String,
    required: true,
    minlenght: 3
  },
  vendor_mobile: {
    type: Number,
    required: true  
  },
  reason_for_blacklist: {
    type: String,
    minlenght: 3
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


