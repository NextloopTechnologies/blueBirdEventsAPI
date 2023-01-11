import { model, Schema } from "mongoose";

const freelancerAssignedEventSchema = new Schema({
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
    freelancer_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Freelancer'
    },
    department_type: {
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