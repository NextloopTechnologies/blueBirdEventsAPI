import { VendorProdDecorChecklist } from '../../../models';

export const create = async(values) => {
    try {
        const vendorproddecorchecklist = new VendorProdDecorChecklist(values);
        await vendorproddecorchecklist.save();
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, vendorproddecorchecklist }
    } catch (error) {
        throw error;
    }
};

export const read = async(whereClause={}) => {
    try {
        const vendorproddecorchecklist = await VendorProdDecorChecklist.find(whereClause)
        .populate({path: 'vendor_id', select: 'vendor_name'})
        .sort({ _id: -1 });
        if(!vendorproddecorchecklist.length > 0) {
            return { status: 404 , msgText: "VendorProdDecorChecklist does not exists!" ,success: false }
        }
        return { status: 200, success: true, vendorproddecorchecklist}
    } catch (error) {
        throw error;

    }
};

export const update = async(id, values) => {
    try {
        const vendorproddecorchecklist = await VendorProdDecorChecklist.findByIdAndUpdate(id, values);
        if(!vendorproddecorchecklist) {
            return { status: 404 , msgText: "VendorProdDecorChecklist does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(id)=> {
    try {
        const vendorproddecorchecklist = await VendorProdDecorChecklist.findByIdAndDelete(id);  
        if(!vendorproddecorchecklist) {
            return { status: 404, msgText: "VendorProdDecorChecklist does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};