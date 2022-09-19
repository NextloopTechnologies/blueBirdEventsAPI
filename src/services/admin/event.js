import { Event } from '../../models';

export const create = async(values) => {
    try {
        const event = new Event(values);
        await event.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, event }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const event = await Event.find(whereClause).sort({ _id: -1 });
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

export const remove = async(id)=> {
    try {
        const event = await Event.findByIdAndDelete(id);  
        if(!event) {
            return { status: 404, msgText: "Event does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};