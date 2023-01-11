import { PriortizationList } from '../../../models';

export const create = async(values) => {
    try {
        const priortizationlist = new PriortizationList(values);
        await priortizationlist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, priortizationlist }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const priortizationlist = await PriortizationList.find(whereClause)
        .populate([{path: 'client_id', select: ['name']},
        {path: 'event_id', select: ['event_title']}])
        .sort({ _id: -1 });
        if(!priortizationlist.length > 0) {
            return { status: 404 , msgText: "PriortizationList does not exists!" ,success: false }
        }
        return { status: 200, success: true, priortizationlist}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const priortizationlist = await PriortizationList.findByIdAndUpdate(id, values);
        if(!priortizationlist) {
            return { status: 404 , msgText: "PriortizationList does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await PriortizationList.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};