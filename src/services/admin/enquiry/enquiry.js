import { Enquiry } from '../../../models';

export const create = async(values) => {
    try {
        const enquiry = new Enquiry(values);
        await enquiry.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, enquiry }
    } catch (error) {
        throw error;
    }
};

export const read = async({ page, perPage, whereClause={} }) => {
    try {
        const enquiry = await Enquiry.find(whereClause)
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!enquiry.length > 0) {
            return { status: 404 , msgText: "Enquiry does not exists!" ,success: false }
        }
        return { status: 200, success: true, enquiry}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await Enquiry.deleteMany({"_id": { "$in" : ids}});  
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};