import { Event, RoomAllotment } from '../../../models';

export const create = async(values) => {
    try {
        const roomallotment = new RoomAllotment(values);
        await roomallotment.save();
        await Event.updateOne({
            // client_id: values.client_id,
            _id: values.event_id,
            'hotels.hotel_rooms_required.hotel_room_id': values.hotel_room_id
        }, 
        {
            $set: {
                'hotels.$[].hotel_rooms_required.$[].room_nos.$[room].isBooked': 1
            },
        },
        {
            arrayFilters: [
                {
                    "room.hotel_room_id": values.hotel_room_id
                }
            ]
        }
        )
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, roomallotment }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const roomallotment = await RoomAllotment.find(whereClause)
        .populate([
        // {path: 'client_id', select: ['name']},
        {path: 'event_id', select: ['event_title']},
        {path: 'hotel_room_id', select: ['hotel_id','room_no','floor_no']},
        {path: 'guest_id', select: ['guest_name','guest_mobile','guest_add','guest_email']}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!roomallotment.length > 0) {
            return { status: 404 , msgText: "RoomAllotment does not exists!" ,success: false }
        }
        return { status: 200, success: true, roomallotment}
    } catch (error) {
        throw error;
    }
};

export const readGuest = async(hotels, event_id) => {
    try {
        let hotel_room_ids = [];
        for(const hotel of hotels) {
            for (const hotelroom of hotel.hotel_rooms_required) {
                for (const roomnos of hotelroom.room_nos) {
                    if(roomnos.isBooked === 1){
                        hotel_room_ids.push({'hotel_room_id': roomnos.hotel_room_id, event_id});
                    } else {
                        roomnos.guestDetails = undefined;
                    }
                }
            }
        };
        if(hotel_room_ids.length > 0){
            const guestRoomAllotments = await Promise.all(hotel_room_ids.map(async(hotel_room_id) => {
                return await RoomAllotment.findOne(hotel_room_id)
                .populate('guest_id','-client_id -event_id -guest_outstation -guest_invited -guest_expected_nos -guest_invitation_type -__v -createdAt -updatedAt')
               
            }));
            const guestDetails = guestRoomAllotments.filter(guest => guest !== null)
            if(guestDetails.length > 0){
                for(const hotel of hotels) {
                    for (const hotelroom of hotel.hotel_rooms_required) {
                        for (const roomnos of hotelroom.room_nos) {
                            for (const guest of guestDetails) {
                                if(guest){
                                    if(roomnos.hotel_room_id.equals(guest.hotel_room_id)){
                                        roomnos.guestDetails = guest.guest_id;
                                        roomnos.note = guest.note && guest.note;
                                    }
                                }
                            }
                        }
                    }
                };
            }
        };
        return hotels;
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(whereClause={}) => {
    try {
        const roomallotment = await RoomAllotment.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 })
        // .skip(((perPage * page) - perPage))
        // .limit(perPage);
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
        await Event.updateOne({
            // client_id: values.client_id,
            _id: values.event_id,
            'hotels.hotel_rooms_required.hotel_room_id': values.hotel_room_id
        }, 
        {
            $set: {
                'hotels.$[].hotel_rooms_required.$[].room_nos.$[room].isBooked': 1
            },
        },
        {
            arrayFilters: [
                {
                    "room.hotel_room_id": values.hotel_room_id
                }
            ]
        }
        )
       
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        // await RoomAllotment.deleteMany({"_id": { "$in" : ids}});
        const roomallotment = await RoomAllotment.findByIdAndDelete(id);
        console.log("deleted room allotment", roomallotment)
        if(!roomallotment) {
            return { status: 404 , msgText: "RoomAllotment does not exists!" ,success: false }
        }  
        await Event.updateOne({
            // client_id: values.client_id,
            _id: roomallotment.event_id,
            'hotels.hotel_rooms_required.hotel_room_id': roomallotment.hotel_room_id
        }, 
        {
            $set: {
                'hotels.$[].hotel_rooms_required.$[].room_nos.$[room].isBooked': 0
            },
        },
        {
            arrayFilters: [
                {
                    "room.hotel_room_id": roomallotment.hotel_room_id
                }
            ]
        }
        )
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeGuestFromAllotment = async(guest_id)=> {
    try {
        const roomallotment = await RoomAllotment.findOneAndUpdate(
            { guest_id },
            { $pull: { guest_id }},
            { returnDocument: "after" }
        )
        if(roomallotment && Array.isArray(roomallotment.guest_id) && !roomallotment.guest_id.length){
            const roomallotment = await RoomAllotment.findByIdAndDelete(roomallotment._id);
            console.log("deleted room allotment", roomallotment)
            if(roomallotment) {
                await Event.updateOne(
                    {
                        // client_id: values.client_id,
                        _id: roomallotment.event_id,
                        'hotels.hotel_rooms_required.hotel_room_id': roomallotment.hotel_room_id
                    }, 
                    {
                        $set: {
                            'hotels.$[].hotel_rooms_required.$[].room_nos.$[room].isBooked': 0
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "room.hotel_room_id": roomallotment.hotel_room_id
                            }
                        ]
                    }
                )
            }
        }
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await RoomAllotment.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};