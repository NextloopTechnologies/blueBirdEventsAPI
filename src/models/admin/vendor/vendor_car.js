import { Schema, model } from "mongoose";

const vendorCarSchema = Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor'
  },
  car_model: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  owner_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  car_reg: {
    type: String,
    minlength: 3,
    required: true
  },
  car_number: {
    type: String,
    required: true,
    minlength: 3
  },
  car_type: {
    type: String,
    required: true
  },
  driver_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  driver_mobile: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
     timestamps: true
});

const VendorCar = model('VendorCar', vendorCarSchema);

export default VendorCar;


