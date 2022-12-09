import { Schema, model } from "mongoose";

const priortizationListSchema = Schema({
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
  title: {
    type: String,
    required: true,
  },
  descp: {
    type: String
  },
  contact: {
    type: Number
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


