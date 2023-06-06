import { GHMSDepartureMgmt } from '../../../models';

export const create = async(values) => {
    try {
        const ghmsdeparturemgmt = new GHMSDepartureMgmt(values);
        await ghmsdeparturemgmt.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsdeparturemgmt }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const ghmsdeparturemgmt = await GHMSDepartureMgmt.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        { path: 'guest_id', select: 'guest_name'},
        { path: 'car_id', select: ['car_name','car_model','car_number','driver_name']},
        { path: 'client_id', select: 'name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ghmsdeparturemgmt.length > 0) {
            return { status: 404 , msgText: "GHMSDepartureMgmt does not exists!" ,success: false }
        }
        let count = await GHMSDepartureMgmt.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, ghmsdeparturemgmt}
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(whereClause={}) => {
    try {
        const ghmsdeparturemgmt = await GHMSDepartureMgmt.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 })
        // .skip(((perPage * page) - perPage))
        // .limit(perPage);
        if(!ghmsdeparturemgmt.length > 0) {
            return { status: 404 , msgText: "GHMSDepartureMgmt does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsdeparturemgmt}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmsdeparturemgmt = await GHMSDepartureMgmt.findByIdAndUpdate(id, values);
        if(!ghmsdeparturemgmt) {
            return { status: 404 , msgText: "GHMSDepartureMgmt does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await GHMSDepartureMgmt.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await GHMSDepartureMgmt.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};