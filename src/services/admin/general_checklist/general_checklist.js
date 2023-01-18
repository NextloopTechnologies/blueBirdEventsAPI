import { GeneralChecklist } from '../../../models';

export const create = async(values) => {
    try {
        const generalchecklist = new GeneralChecklist(values);
        await generalchecklist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, generalchecklist }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const generalchecklist = await GeneralChecklist.find(whereClause)
        .populate([{path: 'client_id', select: ['name']},
        {path: 'event_id', select: ['event_title']}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!generalchecklist.length > 0) {
            return { status: 404 , msgText: "GeneralChecklist does not exists!" ,success: false }
        }
        return { status: 200, success: true, generalchecklist}
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(id) => {
    try {
        const generalchecklist = await GeneralChecklist.findById(id)
        .select(['-active','-createdAt','-updatedAt','-__v']);
        if(!generalchecklist) {
            return { status: 404 , msgText: "GeneralChecklist does not exists!" ,success: false }
        }
        return { status: 200, success: true, generalchecklist}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const generalchecklist = await GeneralChecklist.findByIdAndUpdate(id, values);
        if(!generalchecklist) {
            return { status: 404 , msgText: "GeneralChecklist does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await GeneralChecklist.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};