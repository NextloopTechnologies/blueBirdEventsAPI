import { EventPhoto } from '../../../models';

export const create = async(values) => {
    try {
        const eventphoto = new EventPhoto(values);
        await eventphoto.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, eventphoto }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const eventphoto = await EventPhoto.find(whereClause)
        .populate({path: 'event_id', select: 'event_title'})
        .sort({ _id: -1 });
        if(!eventphoto.length > 0) {
            return { status: 404 , msgText: "EventPhoto does not exists!" ,success: false }
        }
        let count = await EventPhoto.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, eventphoto}

    } catch (error) {
        throw error;

    }
};

export const readForEvent = async(whereClause) => {
    try {
        const eventphoto = await EventPhoto.findOne(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v']);
        if(!eventphoto) {
            return { status: 404 , msgText: "EventPhoto does not exists!" ,success: false }
        }
        return { status: 200, success: true, eventphoto}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const eventphoto = await EventPhoto.findById(id);
        if(!eventphoto) {
            return { status: 404 , msgText: "EventPhoto does not exists!" ,success: false }
        }  
        if(values.ep_img) {
            eventphoto.ep_img.push.apply(eventphoto.ep_img,values.ep_img);
        }
        if(eventphoto.ep_img.length > 1) {     //if there is only single image skip delete
            if(values.deleted_img) {
                if(values.deleted_img.length === eventphoto.ep_img.length){
                    values.deleted_img.pop();
                }
                for (const value of values.deleted_img) {
                    const  matchedImgIndex = eventphoto.ep_img.findIndex(item => item.file === value)
                    if(matchedImgIndex !== -1){
                        eventphoto.ep_img.splice(matchedImgIndex, 1)
                    }   
                }
            } 
        }
        eventphoto.event_id = values.event_id;
        eventphoto.ep_title = values.ep_title;
        eventphoto.ep_descp = values.ep_descp;
        eventphoto.event_date = values.event_date; 
        await eventphoto.save();
        
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await EventPhoto.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};