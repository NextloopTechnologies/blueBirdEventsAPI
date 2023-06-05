import { roomAllotmentService } from '../..';
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

export const createBulk = async(values) => {
    try {
        const ghmsguestlist = await GHMSGuestList.insertMany(values);;
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsguestlist }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const ghmsguestlist = await GHMSGuestList.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ghmsguestlist.length > 0) {
            return { status: 404 , msgText: "GHMSGuestList does not exists!" ,success: false }
        }
        let count = await GHMSGuestList.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, ghmsguestlist}
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(whereClause={}) => {
    try {
        const ghmsguestlist = await GHMSGuestList.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 })
        // .skip(((perPage * page) - perPage))
        // .limit(perPage);
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
        // await GHMSGuestList.deleteMany({"_id": { "$in" : ids}});
        const deletedGuestList = await Promise.all(ids.map(id => GHMSGuestList.findByIdAndDelete(id)))

        const filteredDeletedGuest = deletedGuestList.filter(guest => guest !== null)
    
        if(filteredDeletedGuest){
            await Promise.all(filteredDeletedGuest.map(({_id}) => roomAllotmentService.removeFromGuest(_id)))
        }

        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await GHMSGuestList.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
