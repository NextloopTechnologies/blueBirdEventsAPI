import { Permission } from '../../models';

export const create = async(values) => {
    try {
        const permission = new Permission(values);
        await permission.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, permission }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const permission = await Permission.find(whereClause).sort({ _id: -1 });
        if(!permission.length > 0) {
            return { status: 404 , msgText: "Permission does not exists!" ,success: false }
        }
        return { status: 200, success: true, permission}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const permission = await Permission.findByIdAndUpdate(id, values);
        if(!permission) {
            return { status: 404 , msgText: "Permission does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const permission = await Permission.findByIdAndDelete(id);  
        if(!permission) {
            return { status: 404, msgText: "Permission does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
