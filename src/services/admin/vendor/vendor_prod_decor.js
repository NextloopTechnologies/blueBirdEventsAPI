import { VendorProdDecor } from '../../../models';

export const create = async(values) => {
    try {
        const vendorproddecor = new VendorProdDecor(values);
        await vendorproddecor.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, vendorproddecor }
    } catch (error) {
        throw error;
    }
};

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const vendorproddecor = await VendorProdDecor.find(whereClause)
        .populate({ path: 'vendor_id', select: ['vendor_name']})
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!vendorproddecor.length > 0) {
            return { status: 404 , msgText: "VendorProdDecor does not exists!" ,success: false }
        }
        return { status: 200, success: true, vendorproddecor}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const vendorproddecor = await VendorProdDecor.findByIdAndUpdate(id, values);
        if(!vendorproddecor) {
            return { status: 404 , msgText: "VendorProdDecor does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        await VendorProdDecor.deleteMany({"_id": { "$in" : ids}});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};