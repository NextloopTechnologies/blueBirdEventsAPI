import { roomAllotmentService } from '../..';
import { GHMSArrivalMgmt, GHMSDepartureMgmt, GHMSGuestList, GHMSLostFound, GHMSOutstation } from '../../../models';

export const create = async(values) => {
    try {
        const ghmsguestlist = new GHMSGuestList(values);
        await ghmsguestlist.save();
        if(ghmsguestlist) await createOtherGuestManagement(ghmsguestlist)
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsguestlist }
    } catch (error) {
        throw error;
    }
};

export const createBulk = async(values) => {
    try {
        const ghmsguestlist = await GHMSGuestList.insertMany(values);
        const promises = ghmsguestlist.map(async(guest) => await createOtherGuestManagement(guest))
        await Promise.all(promises);
        return { status: 201, msgText: 'Created Successfully! ',
        success: true, ghmsguestlist }
    } catch (error) {
        throw error;
    }
};

const createOtherGuestManagement = async(guest) => {
    try {
        const guestDetails = {
            client_id: guest.client_id,
            event_id: guest.event_id,
            guest_id: guest._id,
        };

        return Promise.all([
            GHMSArrivalMgmt.create(guestDetails),
            GHMSDepartureMgmt.create(guestDetails),
            guest.guest_outstation==='Outstation' && GHMSOutstation.create(guestDetails),
        ]);
    } catch (error) {
        throw error
    }
}

export const read = async({page, perPage, whereClause={}}) => {
    try {
        const ghmsguestlist = await GHMSGuestList.find(whereClause)
        .populate([{path: 'event_id', select: 'event_title'},
        {path: 'client_id', select: 'name'}])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!ghmsguestlist.length > 0) {
            return { status: 404 , msgText: "GHMSGuestList does not exists!" ,success: false }
        }
        let count = await GHMSGuestList.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, ghmsguestlist}
    } catch (error) {
        throw error;
    }
};

export const readForEvent = async(whereClause={}) => {
    try {
        const ghmsguestlist = await GHMSGuestList.find(whereClause)
        .select(['-active','-createdAt','-updatedAt','-__v'])
        .sort({ _id: -1 })
        // .skip(((perPage * page) - perPage))
        // .limit(perPage);
        if(!ghmsguestlist.length > 0) {
            return { status: 404 , msgText: "GHMSGuestList does not exists!" ,success: false }
        }
        return { status: 200, success: true, ghmsguestlist}
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {
        const ghmsguestlist = await GHMSGuestList.findByIdAndUpdate(id, values);
        if(!ghmsguestlist) {
            return { status: 404 , msgText: "GHMSGuestList does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const remove = async(ids)=> {
    try {
        const deletedGuestList = await Promise.all(ids.map(id => GHMSGuestList.findByIdAndDelete(id)))

        await Promise.all([
            GHMSArrivalMgmt.deleteMany({ guest_id: { $in: ids } }),
            GHMSDepartureMgmt.deleteMany({ guest_id: { $in: ids } }),
            GHMSLostFound.deleteMany({ guest_id: { $in: ids } }),
            GHMSOutstation.deleteMany({ guest_id: { $in: ids } })
        ])
        
        const filteredDeletedGuest = deletedGuestList.filter(guest => guest !== null)
        
        if(filteredDeletedGuest){
            await Promise.all(filteredDeletedGuest.map(({_id}) => roomAllotmentService.removeGuestFromAllotment(_id)))
        }

        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};

export const removeMultiple = async(event_id)=> {
    try {
        await GHMSGuestList.deleteMany({event_id});
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};
