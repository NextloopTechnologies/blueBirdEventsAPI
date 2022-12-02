import { Schema, model } from "mongoose";

const vendorCarSchema = Schema({
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
  car_type: {
    type: String,
    required: true
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
  active: {
    type: Boolean,
    default: true
  }
}, {
     timestamps: true
});

const VendorCar = model('VendorCar', vendorCarSchema);

export default VendorCar;


