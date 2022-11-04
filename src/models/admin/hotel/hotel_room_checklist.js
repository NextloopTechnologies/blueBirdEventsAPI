import { model, Schema } from "mongoose";

const hotelRoomChecklistSchema = new Schema({
    hotel_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel'
    }, 
    room_type_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HotelRoomType'
    },
    checklist_name: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const HotelRoomChecklist = model('HotelRoomChecklist', hotelRoomChecklistSchema);

export default HotelRoomChecklist;