import { GHMSArrivalMgmt } from '../../../models';

export const create = async(values) => {
    try {
        const ghmsarrivalmgmt = new GHMSArrivalMgmt(values);
        await ghmsarrivalmgmt.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsarrivalmgmt }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const ghmsarrivalmgmt = await GHMSArrivalMgmt.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'guest_id', select: 'guest_name'},
        {path: 'car_id', select: ['car_name','car_model','car_number','driver_name']},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ghmsarrivalmgmt.length > 0) {
            return { status: 404 , msgText: "GHMSArrivalMgmt does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsarrivalmgmt}
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async({page, perPage, whereClause={}}) => {
    try {
        const ghmsarrivalmgmt = await GHMSArrivalMgmt.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ghmsarrivalmgmt.length > 0) {
            return { status: 404 , msgText: "GHMSArrivalMgmt does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsarrivalmgmt}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmsarrivalmgmt = await GHMSArrivalMgmt.findByIdAndUpdate(id, values);
        if(!ghmsarrivalmgmt) {
            return { status: 404 , msgText: "GHMSArrivalMgmt does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await GHMSArrivalMgmt.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await GHMSArrivalMgmt.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
