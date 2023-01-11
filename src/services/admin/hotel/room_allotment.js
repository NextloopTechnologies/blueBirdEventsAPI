import { RoomAllotment } from '../../../models';

export const create = async(values) => {
    try {
        const roomallotment = new RoomAllotment(values);
        await roomallotment.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, roomallotment }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const roomallotment = await RoomAllotment.find(whereClause)
        .populate([
        {path: 'client_id', select: ['name']},
        {path: 'event_id', select: ['event_title']},
        {path: 'hotel_room_id', select: ['hotel_id','room_no','floor_no']},
        {path: 'guest_id', select: ['guest_name','guest_mobile','guest_add','guest_email']}])
        .sort({ _id: -1 });
        if(!roomallotment.length > 0) {
            return { status: 404 , msgText: "RoomAllotment does not exists!" ,success: false }
        }
        return { status: 200, success: true, roomallotment}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const roomallotment = await RoomAllotment.findByIdAndUpdate(id, values);
        if(!roomallotment) {
            return { status: 404 , msgText: "RoomAllotment does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await RoomAllotment.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
