import { model, Schema } from "mongoose";

const ghmsLostFoundSchema = new Schema({
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
    guest_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'GHMSGuestList'
    },
    item_name: {
      type: String,
      required: true
    },
    item_identification: {
      type: String,
      required: true
    },
    lost_place: {
      type: String,
      required: true
    },
    found_place: {
      type: String,
      required: true
    },
    found_by: {
      type: String,
      required: true
    },
    deliver_type: {
      type: String,
      ref: 'Vendor'
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const GHMSLostFound = model('GHMSLostFound', ghmsLostFoundSchema);

export default GHMSLostFound;