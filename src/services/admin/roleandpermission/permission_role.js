import { PermRole } from '../../../models';

export const create = async(values) => {
    try {
        const permrole = new PermRole(values);
        await permrole.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, permrole }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const permrole = await PermRole.find(whereClause)
        .populate([{path:'permission_id', select:'perm_name'}, 
        {path:'role_id', select:'role_name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!permrole.length > 0) {
            return { status: 404 , msgText: "Permission Role does not exists!" ,success: false }
        }
        return { status: 200, success: true, permrole}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const permrole = await PermRole.findByIdAndUpdate(id, values);
        if(!permrole) {
            return { status: 404 , msgText: "Permission Role does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await PermRole.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
