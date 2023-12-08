import { model, Schema } from "mongoose";

const roomAllotmentSchema = new Schema({
    // client_id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User'
    // },
    event_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Event'
    }, 
    hotel_room_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HotelRoom'
    },
    guest_id: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'GHMSGuestList'
    }],
    note: String,
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true });

const RoomAllotment = model('RoomAllotment', roomAllotmentSchema);

export default RoomAllotment;