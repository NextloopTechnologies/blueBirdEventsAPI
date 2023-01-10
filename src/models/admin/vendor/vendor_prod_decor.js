import { Schema, model, SchemaTypeOptions } from "mongoose";

const vendorProdDecorSchema = Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor'
  },
  decor_img: [{
    _id: false,
    file: String
  }],
  decor_title: {
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


