import { Event, GHMSGuestList } from '../../../models';
import { generalChecklistService } from '../..';

export const create = async(values) => {
    try {
        // console.log(values)
        const event = new Event(values.event);
        await event.save();

        values.ghms.guestlist.forEach(guest => {
            guest.client_id = event.client_id
            guest.event_id = event._id
        });

        await GHMSGuestList.insertMany(values.ghms.guestlist);

        values.checklist.client_id = event.client_id
        values.checklist.event_id = event._id

        await generalChecklistService.create(values.checklist);
        
        return { status: 201, msgText: 'Created Successfully! ',
        success: true }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const event = await Event.find(whereClause)
        .populate([{ path: 'client_id', select: 'name'},
        { path: 'hotel_id', select: 'hotel_name'}])
        .select(['event_type','event_title','event_start_date','event_end_date'])
        .sort({ _id: -1 })
        if(!event.length > 0) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }
        return { status: 200, success: true, event}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const event = await Event.findByIdAndUpdate(id, values);
        if(!event) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await Event.deleteMany({"_id": { "$in" : ids}}); 
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};