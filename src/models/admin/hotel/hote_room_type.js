import { Schema, model} from "mongoose";

const hotelRoomTypeSchema = new Schema({
    // hotel_id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'Hotel'
    // }, 
    room_type: {
      type: String,
      unique: true,
      required: true
    }, 
    // beds: {
    //   type: String,
    //   required: true
    // },
    occupancy: {
      type: Number,
      required: true
    },
    // cost_per_night: {
    //   type: Number,
    //   required: true
    // },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const HotelRoomType = model('HotelRoomType', hotelRoomTypeSchema);

export default HotelRoomType;