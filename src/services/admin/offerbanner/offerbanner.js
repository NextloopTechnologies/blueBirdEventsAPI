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

export const read = async(whereClause={}) => {
    try {
        const offerbanner = await OfferBanner.find(whereClause)
        .populate({path: 'event_id', select: 'event_title'})
        .sort({ _id: -1 });
        if(!offerbanner.length > 0) {
            return { status: 404 , msgText: "OfferBanner does not exists!" ,success: false }
        }
        return { status: 200, success: true, offerbanner}
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

export const remove = async(id)=> {
    try {
        const offerbanner = await OfferBanner.findByIdAndDelete(id);  
        if(!offerbanner) {
            return { status: 404, msgText: "OfferBanner does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};