import { EventPhoto } from '../../models';

export const create = async(values) => {
    try {
        const eventphoto = new EventPhoto(values);
        await eventphoto.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, eventphoto }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const eventphoto = await EventPhoto.find(whereClause)
        .populate({path: 'sub_event_id', select: 'subevent_title'})
        .sort({ _id: -1 });
        if(!eventphoto.length > 0) {
            return { status: 404 , msgText: "EventPhoto does not exists!" ,success: false }
        }
        return { status: 200, success: true, eventphoto}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const eventphoto = await EventPhoto.findByIdAndUpdate(id, values);
        if(!eventphoto) {
            return { status: 404 , msgText: "EventPhoto does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const eventphoto = await EventPhoto.findByIdAndDelete(id);  
        if(!eventphoto) {
            return { status: 404, msgText: "EventPhoto does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};