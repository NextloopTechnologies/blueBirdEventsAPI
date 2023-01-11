import { FreelancerAssignedEvent } from '../../../models';

export const create = async(values) => {
    try {
        const freelancerassignedevent = new FreelancerAssignedEvent(values);
        await freelancerassignedevent.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, freelancerassignedevent }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const freelancerassignedevent = await FreelancerAssignedEvent.find(whereClause)
        .populate([{path: 'client_id', select: 'name'},
        {path: 'event_id', select: 'event_title'},
        {path: 'freelancer_id', select: 'name'}])
        .sort({ _id: -1 });
        if(!freelancerassignedevent.length > 0) {
            return { status: 404 , msgText: "FreelancerAssignedEvent does not exists!" ,success: false }
        }
        return { status: 200, success: true, freelancerassignedevent}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const freelancerassignedevent = await FreelancerAssignedEvent.findByIdAndUpdate(id, values);
        if(!freelancerassignedevent) {
            return { status: 404 , msgText: "FreelancerAssignedEvent does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await FreelancerAssignedEvent.deleteMany({"_id": {"$in" : ids }});  
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
