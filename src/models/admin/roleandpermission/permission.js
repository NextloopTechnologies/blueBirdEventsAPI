import { Schema, model } from 'mongoose';

const permissionSchema = new Schema({
    perm_name: {
        type: String,
        required: true,
        minlenght: 3
    },
    active : {
        type: Boolean,
        default : true
    }
},{ 
    timestamps: true
});

const Permission = model('Permission', permissionSchema);

export default Permission;