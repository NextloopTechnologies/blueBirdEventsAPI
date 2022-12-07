import { VendorFoodBev } from '../../../models';

export const create = async(values) => {
    try {
        const vendorfoodbev = new VendorFoodBev(values);
        await vendorfoodbev.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, vendorfoodbev }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const vendorfoodbev = await VendorFoodBev.find(whereClause)
        .populate([{path: 'client_id', select: ['name']},
        {path: 'sub_event_id', select: ['subevent_title']}])
        .sort({ _id: -1 });
        if(!vendorfoodbev.length > 0) {
            return { status: 404 , msgText: "VendorFoodBev does not exists!" ,success: false }
        }
        return { status: 200, success: true, vendorfoodbev}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const vendorfoodbev = await VendorFoodBev.findByIdAndUpdate(id, values);
        if(!vendorfoodbev) {
            return { status: 404 , msgText: "VendorFoodBev does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await VendorFoodBev.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};