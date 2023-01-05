import { Schema, model } from "mongoose";

const vendorProdDecorChecklistSchema = Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor'
  },
  checklist_name: {
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

const VendorProdDecorChecklist = model('VendorProdDecorChecklist', vendorProdDecorChecklistSchema);

export default VendorProdDecorChecklist;


