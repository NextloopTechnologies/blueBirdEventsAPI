import { GHMSDepartureMgmt } from '../../../models';

export const create = async(values) => {
    try {
        const ghmsdeparutremgmt = new GHMSDepartureMgmt(values);
        await ghmsdeparutremgmt.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsdeparutremgmt }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const ghmsdeparutremgmt = await GHMSDepartureMgmt.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'guest_id', select: 'guest_name'},
        {path: 'car_id', select: ['car_name','car_model','car_number','driver_name']},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 });
        if(!ghmsdeparutremgmt.length > 0) {
            return { status: 404 , msgText: "GHMSDepartureMgmt does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsdeparutremgmt}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmsdeparutremgmt = await GHMSDepartureMgmt.findByIdAndUpdate(id, values);
        if(!ghmsdeparutremgmt) {
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
