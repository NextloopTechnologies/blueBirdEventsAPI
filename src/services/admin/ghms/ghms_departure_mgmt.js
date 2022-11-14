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
        .populate([{path: 'sub_event_id', select: 'subevent_title'},
        {path: 'guest_id', select: 'guest_name'},
        {path: 'vendor_id', select: 'vendor_name'},
        {path: 'car_id', select: ['car_name','car_model','car_number']},
        {path: 'driver_id', select: 'driver_name'},
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

export const remove = async(id)=> {
    try {
        const ghmsdeparutremgmt = await GHMSDepartureMgmt.findByIdAndDelete(id);  
        if(!ghmsdeparutremgmt) {
            return { status: 404, msgText: "GHMSDepartureMgmt does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
