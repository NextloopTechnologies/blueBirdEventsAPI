import { GHMSLostFound } from '../../models';

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
        .populate([{path: 'sub_event_id', select: 'subevent_title'},
        {path: 'guest_id', select: 'guest_name'}])
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

export const remove = async(id)=> {
    try {
        const ghmslostfound = await GHMSLostFound.findByIdAndDelete(id);  
        if(!ghmslostfound) {
            return { status: 404, msgText: "GHMSLostFound does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
