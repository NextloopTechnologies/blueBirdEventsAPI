import { GHMSLostFound } from '../../../models';

export const create = async(values) => {
    try {
        const ghmslostfound = new GHMSLostFound(values);
        await ghmslostfound.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmslostfound }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const ghmslostfound = await GHMSLostFound.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'guest_id', select: 'guest_name'},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 });
        if(!ghmslostfound.length > 0) {
            return { status: 404 , msgText: "GHMSLostFound does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmslostfound}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmslostfound = await GHMSLostFound.findByIdAndUpdate(id, values);
        if(!ghmslostfound) {
            return { status: 404 , msgText: "GHMSLostFound does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await GHMSLostFound.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
