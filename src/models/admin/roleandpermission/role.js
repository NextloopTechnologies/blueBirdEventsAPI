import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
    role_name: {
        type: String,
        required: true,
        minlenght: 6,
        maxlength: 60
    },
    active : {
        type: Boolean,
        default : true
    }
},{ 
    timestamps: true
});

const Role = model('Role', roleSchema);

export default Role;