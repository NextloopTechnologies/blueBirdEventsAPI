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
    room_type: {
      type: String
    },
    occupancy: {
      type: Number
    },
    // booked_from: {
    //   type: Date
    // },
    // booked_to: {
    //   type: Date
    // },
    hospitality_checklist: [{
      _id: false,
      check_id: Number,
      check_name: String
    }],
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const HotelRoom = model('HotelRoom', hotelRoomSchema);

export default HotelRoom;