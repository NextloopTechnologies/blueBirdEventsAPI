import { Freelancer } from '../../models';

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

export const read = async(whereClause={}) => {
    try {
        const freelancer = await Freelancer.find(whereClause).sort({ _id: -1 });
        if(!freelancer.length > 0) {
            return { status: 404 , msgText: "Freelancer does not exists!" ,success: false }
        }
        return { status: 200, success: true, freelancer}
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
        const freelancer = await Freelancer.findByIdAndDelete(id);  
        if(!freelancer) {
            return { status: 404, msgText: "Freelancer does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
