import { VendorCar } from '../../../models';

export const create = async(values) => {
    try {
        const vendorcar = new VendorCar(values);
        await vendorcar.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, vendorcar }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const vendorcar = await VendorCar.find(whereClause)
        .populate({path: 'vendor_id', select: ['vendor_name','vendor_type']})
        .sort({ _id: -1 });
        if(!vendorcar.length > 0) {
            return { status: 404 , msgText: "VendorCar does not exists!" ,success: false }
        }
        return { status: 200, success: true, vendorcar}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const vendorcar = await VendorCar.findByIdAndUpdate(id, values);
        if(!vendorcar) {
            return { status: 404 , msgText: "VendorCar does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const vendorcar = await VendorCar.findByIdAndDelete(id);  
        if(!vendorcar) {
            return { status: 404, msgText: "VendorCar does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};