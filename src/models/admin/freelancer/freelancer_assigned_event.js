import { model, Schema } from "mongoose";

const freelancerAssignedEventSchema = new Schema({
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
    freelancer_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Freelancer'
    },
    department: {
      type: String,
      required: true
    },
    expected_working_hours: {
      type: Number,
      required: true,
    },
    hours_worked: {
      type: Number,
      required: true,
    },
    active : {
        type: Boolean,
        default : true
    }
},{timestamps : true})

const FreelancerAssignedEvent = model ('FreelancerAssignedEvent', freelancerAssignedEventSchema);

export default FreelancerAssignedEvent;