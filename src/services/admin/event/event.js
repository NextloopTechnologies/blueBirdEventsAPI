import { Event,  GeneralChecklist,  GHMSGuestList, PriortizationList, User } from '../../../models';
import { 
    eventPhotoService,
    freelancerAssignedEventService,
    generalChecklistService, 
    ghmsArrivalMgmtService, 
    ghmsDepartureMgmtService, 
    ghmsGuestlistService, 
    ghmsLostFoundService, 
    priortizationListService, 
    roomAllotmentService 
} from '../..';
import { ObjectId, todaysDate } from '../../../utils/helper';

export const create = async(values) => {
    try {
        let event;
        if(!values.event){
            return { status: 400, msgText: 'Provide event detials!',
            success: false }
        }
        event = new Event(values.event);
        await event.save();

        if(event){
            if(values.ghms && values.ghms.guestlist){
                values.ghms.guestlist.forEach(guest => {
                    guest.client_id = event.client_id
                    guest.event_id = event._id
                });
                await GHMSGuestList.insertMany(values.ghms.guestlist);
            }

            // if(values.priortization){
            //     values.priortization.forEach(prior => {
            //         prior.client_id = event.client_id
            //         prior.event_id = event._id
            //     });
            //     await PriortizationList.insertMany(values.priortization);
            // }
            
            if(values.checklist){
                values.checklist.client_id = event.client_id
                values.checklist.event_id = event._id
                await generalChecklistService.create(values.checklist);
            }
        }
        
        return { status: 201, msgText: 'Created Successfully! ',
        success: true }
        
    } catch (error) {
        throw error;
    }
};

export const readAll = async({page, perPage, whereClause={}}) => {
    try {
        const event = await Event.find(whereClause)
        .populate([{ path: 'client_id', select: 'name'},
        { path: 'hotels.hotel_id', select: 'hotel_name'}])
        .select(['event_type','event_title','event_start_date','event_end_date'])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        
        if(!event.length > 0) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }
        let count = await Event.find(whereClause).count();
        if(count === 1) {
            count = undefined;
        }
        return { status: 200, success: true, count, event}
    } catch (error) {
        throw error;
    }
};

export const readCoordinator = async(id) => {
    try {
        let coordinator_ids = [];
        coordinator_ids.push(id);
        const event = await Event.find(
            { 
                coordinator_ids: { $in: coordinator_ids },
                $or: [ 
                    { event_start_date: { $gte: todaysDate }}, 
                    { event_end_date: { $gte: todaysDate }} 
                ]
            }, 
            { _id: 1, event_title: 1}
        ) 
        if(!event.length > 0) {
            return { status: 404 , msgText: "No events assigned!" ,success: false }
        }
        return { status: 200, success: true, event}
    } catch (error) {
        throw error;
    }
};

export const readSingle = async(page, perPage, _id) => {
    try {
        const event = await Event.findById(_id)
        .select(['-active','-createdAt','-updatedAt','-__v']);
        // .populate([{ path: 'client_id', select: 'name'},
        // { path: 'hotels.hotel_id', select: 'hotel_name'},
        // { path: 'event_vendors.vendor_id', select: ['vendor_name','vendor_work',
        // 'vendor_mobile','blacklisted','reason_for_blacklist']}
        // ]);
        if(!event) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        } else {
            if(!event.event_vendors){
                event.event_vendors = undefined
            }
            if(event.event_vendors && event.event_vendors.vendors.length === 0){
                event.event_vendors.vendors = undefined
            }
            if(event.event_vendors && event.event_vendors.cars.length === 0){
                event.event_vendors.cars = undefined
            }
            if(event.event_foodbev.length === 0){
                event.event_foodbev = undefined
            }
            if(event.event_proddecor.length === 0){
                event.event_proddecor = undefined
            }
            if(event.coordinator_ids.length === 0){
                event.coordinator_ids = undefined
            }
        }
        if(event.hotels ){
            if(event.hotels.length > 0) {
                event.hotels = await roomAllotmentService.readGuest(event.hotels, event._id)
            }
        }
        const whereClause = { event_id: _id };
        const { ghmsguestlist: guestlist } = await ghmsGuestlistService.readForEvent(whereClause);
        const { ghmsarrivalmgmt: arrival } = await ghmsArrivalMgmtService.readForEvent(whereClause);
        const { ghmsdeparturemgmt: departure } = await ghmsDepartureMgmtService.readForEvent(whereClause);
        const { ghmslostfound: lostandfound } = await ghmsLostFoundService.readForEvent(whereClause);
        const { roomallotment } = await roomAllotmentService.readForEvent(whereClause);  
        const { priortizationlist: priortization } = await priortizationListService.readForEvent(whereClause);     
        const { deployedfreelancers } = await freelancerAssignedEventService.readForEvent(_id);     
        const { generalchecklist: checklist } = await generalChecklistService.readForEvent(whereClause);     
        const { eventphoto: gallery } = await eventPhotoService.readForEvent(whereClause);     
        
        let ghms;
        if(!guestlist && !arrival && !departure && !lostandfound && !roomallotment){
            ghms = undefined;
        } else {
            ghms = {
                guestlist,
                arrival,
                departure,
                lostandfound,
                roomallotment
            }
        }

        const data = {
            event,
            ghms,
            priortization,
            deployedfreelancers,
            checklist,
            gallery
        }
        
        return { status: 200, success: true, data}
       
    } catch (error) {
        throw error;
    }
};

export const update = async(id, values) => {
    try {

        if(values.event){
            const event = await Event.findByIdAndUpdate(id, values.event);
            if(!event) {
                return { status: 404 , msgText: "Event does not exists!" ,success: false }
            }
        } 
        
        if(values.ghms){
            if(values.ghms.guestlist) {
                const guestlist = await Promise.all(values.ghms.guestlist.map(guest => {
                    return ghmsGuestlistService.update(guest._id, guest)
                }));
            } 
            
            if(values.ghms.arrival) {
                const arrival = await Promise.all(values.ghms.arrival.map(arrival => {
                    return ghmsArrivalMgmtService.update(arrival._id, arrival)
                }));
            } 
            
            if(values.ghms.departure) {
                const departure = await Promise.all(values.ghms.departure.map(departure => {
                    return ghmsDepartureMgmtService.update(departure._id, departure)
                }));
            } 
            
            if(values.ghms.lostandfound) {
                const lostandfound = await Promise.all(values.ghms.lostandfound.map(lostandfound => {
                    return ghmsLostFoundService.update(lostandfound._id, lostandfound)
                }));
            } 
            
            if(values.ghms.roomallotment) {
                const roomallotment = await Promise.all(values.ghms.roomallotment.map(roomallotment => {
                    return roomAllotmentService.update(roomallotment._id, roomallotment)
                }));
            } 
        } 
        
        if(values.priortization) {
            const priortization = await Promise.all(values.priortization.map(prior => {
                return priortizationListService.update(prior._id, prior)
            }));
        } 
        if(values.checklist) {
            const generalchecklist = await generalChecklistService.update(values.checklist._id, values.checklist)
        }

        if(values.gallery) {
            if(values.gallery._id){
                const gallery = await eventPhotoService.update(values.gallery._id, values.gallery)
            }
            const gallery = await eventPhotoService.create(values.gallery);
        }

        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const updateSingleEvent = async(id, values) => {
    try {
        const event = await Event.findByIdAndUpdate(id, values, { returnDocument: 'after' });
        if(!event) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }  
        return { status: 200, msgText: 'Updated Successfully! ',success: true}
    } catch (error) {
        throw error;
    }
};

export const getWhatsappRecipients = async(event_id) => {
    try {
        const event = await Event.aggregate([
            {
                $match: {"_id": ObjectId(event_id)}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "client_id",
                    foreignField: "_id",
                    as: "users"
                }
            }, { $unwind: "$users" },
            {
                $lookup: {
                    from: "ghmsguestlists",
                    localField: "_id",
                    foreignField: "event_id",
                    as: "guests"
                }
            },
            {
                $project: {
                    _id: 1,
                    client_id: '$users._id',
                    client_mobile: '$users.mobile',
                    guest_mobiles: "$guests.guest_mobile"
                }
            }
        ]);
        if(!event.length>0) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }
        const { client_mobile, guest_mobiles } = event[0];
        const recipientMobileNumbers = { client_mobile, guest_mobiles}
        return { status: 200, success: true, recipientMobileNumbers}
    } catch (error) {
        throw error;
    }
}
// export const updateEventIds = async(ids, event_id) => {
//     const users = await Promise.all(ids.map(async(id) => await User.findById(id)))
//     const event_ids = mongoose.Types.ObjectId(event_id);
//     const updatedUsersEvents = await Promise.all(users.map(async(user) => {
//         user.event_ids.push(event_ids);
//         return await user.save();
//     }))
//     return updatedUsersEvents;
// };

export const remove = async(_id)=> {
    try {
        const event = await Event.findOneAndDelete({ _id }); 
        if(!event) {
            return { status: 404, msgText: 'Event does not exists!', success: false}
        }
        
        await ghmsGuestlistService.removeMultiple(_id);
        await ghmsArrivalMgmtService.removeMultiple(_id);
        await ghmsDepartureMgmtService.removeMultiple(_id);
        await ghmsLostFoundService.removeMultiple(_id);
        await roomAllotmentService.removeMultiple(_id);
        await priortizationListService.removeMultiple(_id);
        await GeneralChecklist.findOneAndDelete({event_id: _id });

        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};