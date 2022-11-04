import { Schema, model } from "mongoose";

const vendorCarSchema = Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor'
  },
  car_name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 3,
    maxlength: 30
  },
  car_model: {
      type: String,
      required: true
  },
  car_number: {
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

const VendorCar = model('VendorCar', vendorCarSchema);

export default VendorCar;


