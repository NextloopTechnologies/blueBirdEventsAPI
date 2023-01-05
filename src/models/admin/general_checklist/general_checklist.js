import { model, Schema } from "mongoose";

const generalChecklistSchema = new Schema({
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
    checklist_type: {
      type: String,
      required: true
    },
    generalchecklist_text: {
      type: String
    },
    generalchecklist_date: {
      type: Date
    },
    checklist: [{
      _id: false,
      check_id: Number,
      check_name: String
    }],
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const GeneralChecklist = model('GeneralChecklist', generalChecklistSchema);

export default GeneralChecklist;