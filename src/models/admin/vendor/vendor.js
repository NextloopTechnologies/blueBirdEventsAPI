import { Schema, model } from "mongoose";

const vendorSchema = Schema({
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
  active: {
    type: Boolean,
    default: true
  }
}, {
     timestamps: true
});

const Vendor = model('Vendor', vendorSchema);

export default Vendor;


