import { Vendor } from '../../../models';

export const create = async(values) => {
    try {
        const vendor = new Vendor(values);
        await vendor.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, vendor }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const vendor = await Vendor.find(whereClause)
        .populate([{ path: 'client_id', select: 'name'}, 
        { path: 'sub_event_id', select: 'subevent_title'}])
        .sort({ _id: -1 });
        if(!vendor.length > 0) {
            return { status: 404 , msgText: "Vendor does not exists!" ,success: false }
        }
        return { status: 200, success: true, vendor}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(id, values);
        if(!vendor) {
            return { status: 404 , msgText: "Vendor does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await Vendor.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
