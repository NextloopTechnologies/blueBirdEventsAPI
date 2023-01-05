import { model, Schema } from "mongoose";

const hospitalityChecklistSchema = new Schema({
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
    hotel_room_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HotelRoom'
    },
    hotel_room_type_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'HotelRoomType'
    },
    hotel_room_checklist: [{
      _id: false,
      checklist_id: Schema.Types.ObjectId
      // checklist_name: String
    }],
    remarks: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true });

const HospitalityChecklist = model('HospitalityChecklist', hospitalityChecklistSchema);

export default HospitalityChecklist;