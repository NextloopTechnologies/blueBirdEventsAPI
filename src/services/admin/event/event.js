import { Event,  GHMSGuestList, } from '../../../models';
import { 
    eventPhotoService,
    generalChecklistService, 
    ghmsArrivalMgmtService, 
    ghmsDepartureMgmtService, 
    ghmsGuestlistService, 
    ghmsLostFoundService, 
    roomAllotmentService 
} from '../..';

export const create = async(values) => {
    try {
        let event;
        if(values.event){
            event = new Event(values.event);
            await event.save();
        }
    
        if(values.ghms && values.ghms.guestlist){
            values.ghms.guestlist.forEach(guest => {
                guest.client_id = event.client_id
                guest.event_id = event._id
            });
            await GHMSGuestList.insertMany(values.ghms.guestlist);
        }
        
        if(values.checklist){
            values.checklist.client_id = event.client_id
            values.checklist.event_id = event._id
            await generalChecklistService.create(values.checklist);
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
        { path: 'hotel_id', select: 'hotel_name'}])
        .select(['event_type','event_title','event_start_date','event_end_date'])
        .sort({ _id: -1 }).skip(((perPage * page) - perPage))
        .limit(perPage);
        if(!event.length > 0) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }
        return { status: 200, success: true, event}
    } catch (error) {
        throw error;
    }
};

export const readSingle = async(page, perPage, _id) => {
    try {
        const whereClause = { event_id: _id };
        const event = await Event.find({ _id })
        .populate([{ path: 'client_id', select: 'name'},
        { path: 'hotel_id', select: 'hotel_name'},
        { path: 'event_vendors.vendor_id', select: ['vendor_name','vendor_work',
        'vendor_mobile','blacklisted','reason_for_blacklist']},
        { path: 'event_car', select: ['car_model','car_number','driver_name','driver_mobile']},
        { path: 'event_proddecor.prod_decor_id', select: ['decor_img','decor_title']}
        ])
        .sort({ _id: -1 });

        if(!event.length > 0) {
            return { status: 404 , msgText: "Event does not exists!" ,success: false }
        }

        const { ghmsguestlist: guestlist } = await ghmsGuestlistService.read({ page, perPage, whereClause });
        const { ghmsarrivalmgmt: arrival } = await ghmsArrivalMgmtService.read({ page, perPage, whereClause });
        const { status, ghmsdeparturemgmt: departure } = await ghmsDepartureMgmtService.read({ page, perPage, whereClause });
        const { ghmslostfound: lostandfound } = await ghmsLostFoundService.read({ page, perPage, whereClause });
        const { roomallotment } = await roomAllotmentService.read({ page, perPage, whereClause });  
        const { generalchecklist: checklist } = await generalChecklistService.read({ page, perPage, whereClause });     
        
        console.log(status, departure);
        const data = {
            event,
            ghms: {
                guestlist,
                arrival,
                departure,
                lostandfound,
                roomallotment
            },
            checklist
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

export const remove = async(ids)=> {
    try {
        await Event.deleteMany({"_id": { "$in" : ids}}); 
        return { status: 200, msgText: 'Deleted Successfully!', success: true}
    } catch (error) {
        throw error;
    }
};