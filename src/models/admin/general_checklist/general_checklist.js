import { model, Schema } from "mongoose";

const generalChecklistSchema = new Schema({
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
    general_checklist: [{
      // _id: false,
      checklist_type: {
        type: String,
        required: true
      },
      generalchecklist_text: {type: String, minlength: 3},
      generalchecklist_date: Date,
      checklist: [{
        _id: false,
        check_id: Number,
        check_name: String
      }]
    }],
    active: {
      type: Boolean,
      default: true
    }
}, { timestamps: true});

const GeneralChecklist = model('GeneralChecklist', generalChecklistSchema);

export default GeneralChecklist;