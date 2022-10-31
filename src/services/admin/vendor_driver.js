import { VendorDriver } from '../../models';

export const create = async(values) => {
    try {
        const vendordriver = new VendorDriver(values);
        await vendordriver.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, vendordriver }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const vendordriver = await VendorDriver.find(whereClause)
        .populate({path: 'vendor_id', select: ['vendor_name','vendor_type']})
        .sort({ _id: -1 });
        if(!vendordriver.length > 0) {
            return { status: 404 , msgText: "VendorDriver does not exists!" ,success: false }
        }
        return { status: 200, success: true, vendordriver}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const vendordriver = await VendorDriver.findByIdAndUpdate(id, values);
        if(!vendordriver) {
            return { status: 404 , msgText: "VendorDriver does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const vendordriver = await VendorDriver.findByIdAndDelete(id);  
        if(!vendordriver) {
            return { status: 404, msgText: "VendorDriver does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};