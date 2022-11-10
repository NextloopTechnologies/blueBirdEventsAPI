import { Schema, model } from "mongoose";

const vendorProdDecorSchema = Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor'
  },
  prod_decor_checklist_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'VendorProdDecorChecklist'
  },
  prod_decor_img: [{
    _id: false,
    file: String
  }],
  note: {
    type: String
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


