import { Freelancer, FreelancerAssignedEvent } from '../../../models';

export const create = async(values) => {
    try {
        const freelancer = new Freelancer(values);
        await freelancer.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, freelancer }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const freelancer = await Freelancer.find(whereClause)
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!freelancer.length > 0) {
            return { status: 404 , msgText: "Freelancer does not exists!" ,success: false }
        }
        let count = await Freelancer.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, freelancer}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const freelancer = await Freelancer.findByIdAndUpdate(id, values);
        if(!freelancer) {
            return { status: 404 , msgText: "Freelancer does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const deletedFreelancer = await Freelancer.findByIdAndDelete(id);
        if(deletedFreelancer){
            await FreelancerAssignedEvent.deleteMany({"freelancer_id": deletedFreelancer._id });
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
