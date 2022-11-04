import { Schema, model } from 'mongoose';

const permRoleSchema = new Schema({
    permission_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Permission'
    },
    role_id : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    }
},{ 
    timestamps: true
});

const PermRole = model('PermRole', permRoleSchema);

export default PermRole;