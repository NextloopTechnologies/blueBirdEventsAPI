import { model, Schema } from "mongoose";

const freelancerAssignedEventSchema = new Schema({
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
      type: Number
    },
    hours_worked: {
      type: Number
    },
    active : {
        type: Boolean,
        default : true
    }
},{timestamps : true})

const FreelancerAssignedEvent = model ('FreelancerAssignedEvent', freelancerAssignedEventSchema);

export default FreelancerAssignedEvent;