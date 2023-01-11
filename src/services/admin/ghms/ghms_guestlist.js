import { GHMSGuestList } from '../../../models';

export const create = async(values) => {
    try {
        const ghmsguestlist = new GHMSGuestList(values);
        await ghmsguestlist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsguestlist }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const ghmsguestlist = await GHMSGuestList.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 });
        if(!ghmsguestlist.length > 0) {
            return { status: 404 , msgText: "GHMSGuestList does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsguestlist}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmsguestlist = await GHMSGuestList.findByIdAndUpdate(id, values);
        if(!ghmsguestlist) {
            return { status: 404 , msgText: "GHMSGuestList does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await GHMSGuestList.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
