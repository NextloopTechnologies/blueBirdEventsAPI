import { HotelRoomType } from '../../models';

export const create = async(values) => {
    try {
        const hotelroomtype = new HotelRoomType(values);
        await hotelroomtype.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, hotelroomtype }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const hotelroomtype = await HotelRoomType.find(whereClause)
        .populate({path: 'hotel_id', select: 'hotel_name'})
        .sort({ _id: -1 });
        if(!hotelroomtype.length > 0) {
            return { status: 404 , msgText: "HotelRoomType does not exists!" ,success: false }
        }
        return { status: 200, success: true, hotelroomtype}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const hotelroomtype = await HotelRoomType.findByIdAndUpdate(id, values);
        if(!hotelroomtype) {
            return { status: 404 , msgText: "HotelRoomType does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const hotelroomtype = await HotelRoomType.findByIdAndDelete(id);  
        if(!hotelroomtype) {
            return { status: 404, msgText: "HotelRoomType does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
