import { Schema, model } from "mongoose";

const vendorFodBevSchema = Schema({
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
  food_type: {
    type: String,
    required: true,
  },
  food_sub_type: {
      type: String
  },
  dish_name: {
    type: String,
    required: true,
    trim: true,
  },
  serve_date: {
    type: Date,
    required: true
  },
  serve_start_time: {
    type: String,
    required: true
  },
  serve_end_time: {
    type: String,
    required: true
  },
  plates_guaranteed: {
    type: String,
    required: true
  },
  plated_added: {
    type: String,
    required: true
  },
  plated_remaining: {
    type: String,
    required: true
  },
  plates_used: {
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

const VendorFoodBev = model('VendorFoodBev', vendorFodBevSchema);

export default VendorFoodBev;


