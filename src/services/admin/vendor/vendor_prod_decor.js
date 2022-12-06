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

export const read = async(whereClause={}) => {
    try {
        const vendorproddecor = await VendorProdDecor.find(whereClause)
        .populate([{path: 'client_id', select: 'name'},
        {path: 'sub_event_id', select: 'subevent_title'}])
        .sort({ _id: -1 });
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

export const remove = async(id)=> {
    try {
        const vendorproddecor = await VendorProdDecor.findByIdAndDelete(id);  
        if(!vendorproddecor) {
            return { status: 404, msgText: "VendorProdDecor does not exists!", success:false}
        }
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};