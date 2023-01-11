import { model, Schema } from "mongoose";

const freelancerSchema = new Schema({
    department_type: {
      type: String,
      required: true
    },
    wa_contact_no : {
      type: Number
    },
    alt_contact_no : {
      type: Number
    },
    gender: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    current_city: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      required: true,
      trim: true
    },
    pass_size_pic: {
      type: String,
      required: true,
      trim: true
    },
    tshirt_size: {
      type: String,
      required: true,
      trim: true
    },
    name:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true
    },
    course : {
      type: String,
      required: true,
      trim: true
    },
    coordination : {
      type: String,
      required: true,
      trim: true
    },
    work_of_shadow : {
      type: String,
      required: true,
      trim: true
    },
    active : {
        type: Boolean,
        default : true
    }
},{timestamps : true})

const Freelancer = model ('Freelancer', freelancerSchema);

export default Freelancer;