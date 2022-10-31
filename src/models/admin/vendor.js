import { Schema, model } from "mongoose";

const vendorSchema = Schema({
  vendor_name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3,
    maxlength: 30
  },
  vendor_mobile: {
      type: Number,
      required: true
  },
  vendor_email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
  },
  vendor_add: {
    type: String,
    required: true
  },
  vendor_type: {
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


