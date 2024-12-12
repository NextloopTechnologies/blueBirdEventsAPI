import { model, Schema } from "mongoose";

const hospitalityChecklistSchema = new Schema({
  _id: false,
  check_id: {
    type: Number,
    required: true,
  },
  check_name: {
    type: String,
    required: true,
  },
  room_checked_time: {
    type: Date,
    default: Date.now,
  },
});

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
      // required: true,
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
    hospitality_checklist: [hospitalityChecklistSchema],
    // is_hospitality_checklist_visible: {
    //   type: Boolean,
    //   default: true
    // },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const HotelRoom = model('HotelRoom', hotelRoomSchema);

export default HotelRoom;