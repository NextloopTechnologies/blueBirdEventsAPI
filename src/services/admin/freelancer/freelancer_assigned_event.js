import { FreelancerAssignedEvent } from '../../../models';
import { ObjectId } from '../../../utils/helper';

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

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const freelancerassignedevent = await FreelancerAssignedEvent.find(whereClause)
        .populate([
        {path: 'event_id', select: 'event_title'},
        {path: 'freelancer_id', select: 'name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!freelancerassignedevent.length > 0) {
            return { status: 404 , msgText: "FreelancerAssignedEvent does not exists!" ,success: false }
        }
        let count = await FreelancerAssignedEvent.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, freelancerassignedevent}

    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(event_id) => {
    try {
        // const deployedfreelancers = await FreelancerAssignedEvent.find({event_id})
        // .select(['-active','-createdAt','-updatedAt','-__v'])
        // .sort({ _id: -1 })
        // .skip(((perPage * page) - perPage))
        // .limit(perPage);
        const deployedfreelancers = await FreelancerAssignedEvent.aggregate([
        {
            $match : { event_id: ObjectId(event_id) }
        },
        {
            $lookup: {
                from: "freelancers",
                localField: "freelancer_id",
                foreignField: "_id",
                as: "freelancer"
            }
        }, 
        { 
            $unwind: '$freelancer'
        },
        {
            $project: {
                _id: 1,
                event_id: 1,
                freelancer_id: 1,
                department_type: 1,
                expected_working_hours: 1,
                hours_worked: 1,
                freelancer_name: "$freelancer.name"
            }
        },
        { 
            $sort: { _id: -1 }
        }]);
        // console.log("deplyed freelancer", deployedfreelancers);
        if(!deployedfreelancers.length > 0) {
            return { status: 404 , msgText: "Freelancer Assignee does not exists!" ,success: false }
        }
        return { status: 200, success: true, deployedfreelancers}
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
