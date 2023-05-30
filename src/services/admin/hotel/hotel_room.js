import { HotelRoom } from '../../../models';

export const create = async(values) => {
    try {
        // const hotelroom = new HotelRoom(values);
        // await hotelroom.save();
        const hotelroom =  await HotelRoom.insertMany(values);
        // console.log(values);
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, hotelroom }
    } catch (error) {
        throw error;
    }
};

export const readAll = async({page, perPage,whereClause={}}) => {
    try {
        const hotelroom = await HotelRoom.find(whereClause)
        .populate([
            {path: 'hotel_id', select: 'hotel_name'},
            // {path: 'room_type_id', select: ['room_type','occupancy']}
        ])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        
        if(!hotelroom.length > 0) {
            return { status: 404 , msgText: "HotelRoom does not exists!" ,success: false }
        }
        return { status: 200, success: true, hotelroom}
    } catch (error) {
        throw error;
    }
};

export const readCheckedRoom = async(id) => {
    try {
        const hotelroom = await HotelRoom.find({ hotel_id: id })
        .sort({ _id: -1 })
        if(!hotelroom.length > 0) {
            return { status: 404 , msgText: "HotelRoom does not exists!" ,success: false }
        }
        return { status: 200, success: true, hotelroom}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const hotelroom = await HotelRoom.findByIdAndUpdate(id, values);
        if(!hotelroom) {
            return { status: 404 , msgText: "HotelRoom does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await HotelRoom.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
