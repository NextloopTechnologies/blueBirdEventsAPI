import { model, Schema } from "mongoose";

const hotelRoomSchema = new Schema({
    hotel_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel'
    }, 
    room_no: {
      type: Number,
      required: true,
    }, 
    floor_no: {
      type: Number,
      required: true
    },
    room_type_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HotelRoomType'
    },
    booked_from: {
      type: Date,
      required: true
    },
    booked_to: {
      type: Date,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const HotelRoom = model('HotelRoom', hotelRoomSchema);

export default HotelRoom;