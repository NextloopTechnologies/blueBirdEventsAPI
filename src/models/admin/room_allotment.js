import { model, Schema } from "mongoose";

const roomAllotmentSchema = new Schema({
    // sub_event_id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'SubEvent'
    // }, 
    hotel_room_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HotelRoom'
    },
    guest_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'GHMSGuestList'
    },
    remarks: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const RoomAllotment = model('RoomAllotment', roomAllotmentSchema);

export default RoomAllotment;