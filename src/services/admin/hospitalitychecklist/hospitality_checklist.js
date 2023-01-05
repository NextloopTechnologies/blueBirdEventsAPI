import { HospitalityChecklist } from '../../../models';

export const create = async(values) => {
    try {
        const hospitalitychecklist = new HospitalityChecklist(values);
        await hospitalitychecklist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, hospitalitychecklist }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const hospitalitychecklist = await HospitalityChecklist.find(whereClause)
        .populate([
        {path: 'client_id', select: ['name']},
        {path: 'sub_event_id', select: ['event_id','subevent_title']},
        {path: 'hotel_room_id', select: ['hotel_id','room_no']},
        {path: 'hotel_room_type_id', select: ['room_type_name']}])
        .sort({ _id: -1 });
        if(!hospitalitychecklist.length > 0) {
            return { status: 404 , msgText: "HospitalityChecklist does not exists!" ,success: false }
        }
        return { status: 200, success: true, hospitalitychecklist}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const hospitalitychecklist = await HospitalityChecklist.findByIdAndUpdate(id, values);
        if(!hospitalitychecklist) {
            return { status: 404 , msgText: "HospitalityChecklist does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const hospitalitychecklist = await HospitalityChecklist.findByIdAndDelete(id);  
        if(!hospitalitychecklist) {
            return { status: 404, msgText: "HospitalityChecklist does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
