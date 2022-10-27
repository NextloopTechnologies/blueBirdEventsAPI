import { SubEvent } from '../../models';

export const create = async(values) => {
    try {
        const subevent = new SubEvent(values);
        await subevent.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, subevent }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const subevent = await SubEvent.find(whereClause)
        .populate({path: 'event_id', select: ['event_title']})
        .sort({ _id: -1 });
        if(!subevent.length > 0) {
            return { status: 404 , msgText: "SubEvent does not exists!" ,success: false }
        }
        return { status: 200, success: true, subevent}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const subevent = await SubEvent.findByIdAndUpdate(id, values);
        if(!subevent) {
            return { status: 404 , msgText: "SubEvent does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const subevent = await SubEvent.findByIdAndDelete(id);  
        if(!subevent) {
            return { status: 404, msgText: "SubEvent does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};