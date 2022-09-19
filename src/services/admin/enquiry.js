import { Enquiry } from '../../models';

export const create = async(values) => {
    try {
        const enquiry = new Enquiry(values);
        await enquiry.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, enquiry }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const enquiry = await Enquiry.find(whereClause)
                                    .populate({path: 'event_id', select: 'event_title'})
                                    .sort({ _id: -1 });
        if(!enquiry.length > 0) {
            return { status: 404 , msgText: "Enquiry does not exists!" ,success: false }
        }
        return { status: 200, success: true, enquiry}
    } catch (error) {
        throw error;
    }
};

// export const update = async(id, values) => {
//     try {
//         const event = await Event.findByIdAndUpdate(id, values);
//         if(!event) {
//             return { status: 404 , msgText: "Event does not exists!" ,success: false }
//         }  
//         return { status: 200, msgText: 'Updated Successfully! ',success: true}
//     } catch (error) {
//         throw error;
//     }
// };

export const remove = async(id)=> {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(id);  
        if(!enquiry) {
            return { status: 404, msgText: "Enquiry does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};