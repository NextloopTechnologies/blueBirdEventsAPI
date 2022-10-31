import { GHMSArrivalMgmt } from '../../models';

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

export const read = async(whereClause={}) => {
    try {
        const ghmsarrivalmgmt = await GHMSArrivalMgmt.find(whereClause)
        .populate([{path: 'sub_event_id', select: 'subevent_title'},
        {path: 'guest_id', select: 'guest_name'},
        {path: 'vendor_id', select: 'vendor_name'},
        {path: 'car_id', select: ['car_name','car_model','car_number']},
        {path: 'driver_id', select: 'driver_name'}])
        .sort({ _id: -1 });
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

export const remove = async(id)=> {
    try {
        const ghmsarrivalmgmt = await GHMSArrivalMgmt.findByIdAndDelete(id);  
        if(!ghmsarrivalmgmt) {
            return { status: 404, msgText: "GHMSArrivalMgmt does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
