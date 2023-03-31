import { Schema, model } from "mongoose";

const priortizationListSchema = Schema({
  event_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  },  
  title: {
    type: String,
    minlength: 3,
    required: true,
  },
  descp: {
    type: String,
    minlength: 3
  },
  contact: {
    type: String
  },
  deadline_date: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
     timestamps: true
});

const PriortizationList = model('PriortizationList', priortizationListSchema);

export default PriortizationList;


