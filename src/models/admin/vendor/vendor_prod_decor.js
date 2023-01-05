import { Schema, model } from "mongoose";

const vendorProdDecorSchema = Schema({
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
  prod_decor_img: [{
    _id: false,
    file: String
  }],
  img_title: {
    type: String,
    required: true
  },
  decor_date: {
    type: Date,
    required: true
  },
  expected_decor_time: {
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

const VendorProdDecor = model('VendorProdDecor', vendorProdDecorSchema);

export default VendorProdDecor;


