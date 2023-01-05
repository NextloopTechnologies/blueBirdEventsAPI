import { HotelRoomChecklist } from '../../../models';

export const create = async(values) => {
    try {
        const hotelroomchecklist = new HotelRoomChecklist(values);
        await hotelroomchecklist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, hotelroomchecklist }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const hotelroomchecklist = await HotelRoomChecklist.find(whereClause)
        .populate([{path: 'hotel_id', select: 'hotel_name'}, 
        {path: 'room_type_id', select: 'room_type_name'}])
        .sort({ _id: -1 });
        if(!hotelroomchecklist.length > 0) {
            return { status: 404 , msgText: "HotelRoomChecklist does not exists!" ,success: false }
        }
        return { status: 200, success: true, hotelroomchecklist}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const hotelroomchecklist = await HotelRoomChecklist.findByIdAndUpdate(id, values);
        if(!hotelroomchecklist) {
            return { status: 404 , msgText: "HotelRoomChecklist does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const hotelroomchecklist = await HotelRoomChecklist.findByIdAndDelete(id);  
        if(!hotelroomchecklist) {
            return { status: 404, msgText: "HotelRoomChecklist does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
