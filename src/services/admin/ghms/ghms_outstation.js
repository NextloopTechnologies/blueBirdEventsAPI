import { GHMSOutstation } from '../../../models';

export const create = async(values) => {
    try {
        const ghmsoutstation = new GHMSOutstation(values);
        await ghmsoutstation.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsoutstation }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const ghmsoutstation = await GHMSOutstation.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'guest_id', select: ['guest_name', 'guest_mobile']},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ghmsoutstation.length > 0) {
            return { status: 404 , msgText: "GHMSOutstation does not exists!" ,success: false }
        }
        let count = await GHMSOutstation.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, ghmsoutstation}
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(whereClause={}) => {
    try {
        const ghmsoutstation = await GHMSOutstation.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 })
        // .skip(((perPage * page) - perPage))
        // .limit(perPage);
        if(!ghmsoutstation.length > 0) {
            return { status: 404 , msgText: "GHMSOutstation does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsoutstation}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmsoutstation = await GHMSOutstation.findByIdAndUpdate(id, values, { returnDocument: 'after' });
        if(!ghmsoutstation) {
            return { status: 404 , msgText: "GHMSOutstation does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true, updatedOutstation: ghmsoutstation}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await GHMSOutstation.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await GHMSOutstation.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
