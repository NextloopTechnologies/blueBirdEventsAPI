import { Role } from '../../models';

export const create = async(values) => {
    try {
        const role = new Role(values);
        await role.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, role }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const role = await Role.find(whereClause).sort({ _id: -1 });
        if(!role.length > 0) {
            return { status: 404 , msgText: "Role does not exists!" ,success: false }
        }
        return { status: 200, success: true, role}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const role = await Role.findByIdAndUpdate(id, values);
        if(!role) {
            return { status: 404 , msgText: "Role does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const role = await Role.findByIdAndDelete(id);  
        if(!role) {
            return { status: 404, msgText: "Role does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
