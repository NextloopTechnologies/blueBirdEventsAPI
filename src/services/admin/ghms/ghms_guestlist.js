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
        .populate([{path: 'sub_event_id', select: 'subevent_title'},
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

export const remove = async(id)=> {
    try {
        const ghmsguestlist = await GHMSGuestList.findByIdAndDelete(id);  
        if(!ghmsguestlist) {
            return { status: 404, msgText: "GHMSGuestList does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
