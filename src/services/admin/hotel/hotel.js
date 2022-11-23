import { Hotel } from '../../../models';

export const create = async(values) => {
    try {
        const hotel = new Hotel(values);
        await hotel.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, hotel }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const hotel = await Hotel.find(whereClause).sort({ _id: -1 });
        if(!hotel.length > 0) {
            return { status: 404 , msgText: "Hotel does not exists!" ,success: false }
        }
        return { status: 200, success: true, hotel}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(id, values);
        if(!hotel) {
            return { status: 404 , msgText: "Hotel does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await Hotel.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
