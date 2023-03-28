import { OfferBanner } from '../../../models';

export const create = async(values) => {
    try {
        const offerbanner = new OfferBanner(values);
        await offerbanner.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, offerbanner }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const offerbanner = await OfferBanner.find(whereClause)
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!offerbanner.length > 0) {
            return { status: 404 , msgText: "OfferBanner does not exists!" ,success: false }
        }
        let count = await OfferBanner.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, offerbanner}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const offerbanner = await OfferBanner.findByIdAndUpdate(id, values);
        if(!offerbanner) {
            return { status: 404 , msgText: "OfferBanner does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await OfferBanner.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};