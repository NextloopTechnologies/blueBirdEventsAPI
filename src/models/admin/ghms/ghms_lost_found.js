import { model, Schema } from "mongoose";

const ghmsLostFoundSchema = new Schema({
    client_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    event_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Event'
    },
    guest_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'GHMSGuestList'
    },
    item_name: {
      type: String,
      minlength: 3,
      required: true
    },
    item_identification: {
      type: String,
      minlength: 3,
      required: true
    },
    lost_place: {
      type: String,
      minlength: 3,
      required: true
    },
    found_place: {
      type: String,
      minlength: 3,
      required: true
    },
    found_by: {
      type: String,
      minlength: 3,
      required: true
    },
    deliver_type: {
      type: String,
      enum: ['Self','Courier'],
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const GHMSLostFound = model('GHMSLostFound', ghmsLostFoundSchema);

export default GHMSLostFound;