import { Schema, model } from "mongoose";

const vendorDriverSchema = Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor'
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
  driver_add: {
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

const VendorDriver = model('VendorDriver', vendorDriverSchema);

export default VendorDriver;


