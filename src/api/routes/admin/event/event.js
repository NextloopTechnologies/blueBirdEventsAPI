import { Router } from "express";
import { auth, requestValidator, fileUploads, checkPermission } from '../../../middlewares';
import { eventService, fileService, filterService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.post('', async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await eventService.readAll({ page, perPage, whereClause });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const eventValidation = Joi.object({
    // event //
    id: Joi.string(),

    event: Joi.object({
        _id: Joi.string(),
        client_id: Joi.string().required(),
        coordinator_ids: Joi.array(),
        event_type: Joi.string().required(),
        event_title: Joi.string().min(3).trim().required(),
        event_descp: Joi.string().min(3),
        event_start_date: Joi.date().min(todaysDate).required(),
        event_end_date: Joi.date().greater(Joi.ref('event_start_date')),
        event_remark: Joi.string().min(3),
        // hotel //
        hotels: Joi.array().items({
            hotel_id: Joi.string(),
            hotel_rooms_required: Joi.array().items({
                floor_no: Joi.number().required(),
                room_nos: Joi.array().items({
                    room_no: Joi.number().required(),
                    hotel_room_id: Joi.string().required(),
                    room_type_id: Joi.string().required(),
                    isBooked: Joi.number().valid(0,1).required()
                }).required()
            })
        }), 
        // vendors //
        event_vendors : Joi.array().items({
            vendor_name: Joi.string().min(3).required().trim(),
            vendor_work: Joi.string().min(3).required(),
            vendor_mobile: Joi.string().regex(/^[0-9]{10}$/)
            .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
            reason_for_blacklist: Joi.string().min(3),
            blacklisted: Joi.boolean(),
            scope_of_work: Joi.string().min(3),
            due_amount: Joi.string(),
            paid_amount: Joi.string(),
            total_package: Joi.string(),
            arriving_time: Joi.string()
        }),
        // food bev
        event_foodbev: Joi.array().items({
            food_type: Joi.string().required(),
            menu: Joi.array().items({
                // _id: false,
                file: Joi.string()
            }).required(),
            serve_date: Joi.date().min(todaysDate).required(),
            serve_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
            .messages({'string.pattern.base': `Time should be in 24 hrs format.`}).required(),
            serve_end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
            .messages({'string.pattern.base': `Time should be in 24 hrs format.`}).required(),
            plates_guaranteed: Joi.string().trim(),
            plates_added: Joi.string().trim(),
            plates_remaining: Joi.string().trim(),
            plates_used: Joi.string().trim()
        }),
       
        // vendor prod //
        event_proddecor: Joi.array().items({
            decor_title: Joi.string().min(3).required(),
            decor_img: Joi.array().items({
                 // _id: false,
                 file: Joi.string()
            }).required(),
            decor_remark: Joi.string().min(3),
            decor_date: Joi.date().min(todaysDate).required(),
            expected_decor_time: Joi.string()
        })
    }).required(),
    ghms: Joi.object({
        guestlist: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_name: Joi.string().min(3).required().trim(),
            guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).trim(),
            guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
            .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
            guest_add: Joi.string().min(3),
            guest_outstation: Joi.string().valid('Local','Outstation').required(),
            guest_invited: Joi.string().valid('Individual','Family').required(),
            guest_expected_nos: Joi.number(),
            guest_invitation_type: Joi.valid('Courier','Personally','Digitally'),
            guest_date_of_arrival: Joi.date().min(todaysDate)
        }),
        arrival: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_id: Joi.string().required(),
            car_id: Joi.string().required(),
            arrived_at: Joi.string().required(),
            mode_of_arrival: Joi.string().required(),
            expected_arrival_time: Joi.string().required(),
            welcome_checklist: Joi.string().min(3),
            no_of_guest_arrived: Joi.number().required(),
            special_note: Joi.string().min(3),
            date_of_arrival: Joi.date().min(todaysDate).required(),
        }),
        departure: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_id: Joi.string().required(),
            car_id: Joi.string().required(),
            departure_time: Joi.string().required(),
            mode_of_departure: Joi.string().required(),
            return_checklist: Joi.string().min(3),
            no_of_guest_arrived: Joi.number().required(),
            special_note: Joi.string().min(3),
            date_of_departure: Joi.date().min(todaysDate).required(),
        }),
        // roomallotment: Joi.array().items({
        //     _id: Joi.string(),
        //     client_id: Joi.string(),
        //     event_id: Joi.string(),
        //     hotel_room_id: Joi.string().required(),
        //     guest_id: Joi.string().required(), 
        // }),
        lostandfound: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_id: Joi.string().required(),
            item_name: Joi.string().min(3).required(),
            item_identification: Joi.string().min(3).required(),
            lost_place: Joi.string().min(3).required(),
            found_place: Joi.string().min(3).required(),
            found_by: Joi.string().min(3).required(),
            deliver_type: Joi.string().min(3).required(),
        })
    }),
    priortization: Joi.array().items({
        _id: Joi.string(),
        client_id: Joi.string(),
        event_id: Joi.string(),
        title: Joi.string().min(3).trim().required(),
        descp: Joi.string().min(3).trim(),
        deadline_date: Joi.date().min(todaysDate).required(),
        contact: Joi.string().regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    }),
    checklist: Joi.object({
        _id: Joi.string(),
        client_id: Joi.string(),
        event_id: Joi.string(),
        general_checklist: Joi.array().items({
            _id: Joi.string(),
            checklist: Joi.array().items({
                check_id: Joi.number().required(),
                check_name: Joi.string().required()
            }),  
            checklist_type: Joi.string().valid('Prod','Food','L&C').required(),
            generalchecklist_text: Joi.string().min(3),
            generalchecklist_date: Joi.date().min(todaysDate),
        })
    }).required(),
    gallery: Joi.object({
        _id: Joi.string(),
        event_id: Joi.string(),
        event_date: Joi.date(),
        ep_title: Joi.string().min(3).required(),
        ep_descp: Joi.string().min(3).required(),
        ep_img: Joi.array().items({
            // _id: false,
            file: Joi.string()
        }).required()
    }),
});

router.post('/create', auth, checkPermission('create-event'), requestValidator(eventValidation), async(req, res) => {
    try {
        const { status, ...data } = await eventService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-event'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await eventService.readSingle(page, perPage, _id);
        // console.log("from routes", data.data.event[0].event_foodbev);
        // console.log(foodbev);
        // if(data.data.event[0].event_foodbev){
        //     const filterFoodbev = fileService.fileFilterForList(data.data.event[0].event_foodbev, 'menu');
        //     const urlFoodbev = await fileService.getFileUrl(filterFoodbev,'menu');
        //     for(const food of data.data.event[0].event_foodbev){
        //         for(const urlfood of urlFoodbev){
        //             if(food.food_type === urlfood.food_type && food.serve_date === urlfood.serve_date){
        //                 console.log(typeof urlfood.serve_date, typeof food.serve_date)
        //                 food.menu = urlfood.menu
        //             }
        //         }
        //     }
        // }
        if(data.data){
            if(data.data.event.event_foodbev){
                data.data.event.event_foodbev = fileService.getFilename(data.data.event.event_foodbev, 'menu');
                data.data.event.event_foodbev = await fileService.getFileUrl(data.data.event.event_foodbev,'menu');
            }
    
            if(data.data.event.event_proddecor){
                data.data.event.event_proddecor = fileService.getFilename(data.data.event.event_proddecor,'decor_img');
                data.data.event.event_proddecor = await fileService.getFileUrl(data.data.event.event_proddecor,'decor_img');
            }
    
            if(data.data.gallery){
                data.data.gallery = fileService.getFilename(data.data.gallery,'ep_img');
                data.data.gallery = await fileService.getSingleObjFileUrl(data.data.gallery,'ep_img');
            }
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/coordinatorevent/:id', auth, checkPermission('read-event'), async (req, res)=> {
    try {
        const { status, ...data} = await eventService.readCoordinator(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-event'), requestValidator(eventValidation), async(req, res) => {
    try {
        const { status, ...data} = await eventService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const singleEventValidation = Joi.object({
    client_id: Joi.string().required(),
    coordinator_ids: Joi.array(),
    event_type: Joi.string().required(),
    event_title: Joi.string().min(3).trim().required(),
    event_descp: Joi.string().min(3),
    event_start_date: Joi.date().required(),
    event_end_date: Joi.date().greater(Joi.ref('event_start_date')),
    event_remark: Joi.string().min(3),
    // hotel //
    hotels: Joi.array().items({
        hotel_id: Joi.string(),
        hotel_rooms_required: Joi.array().items({
            floor_no: Joi.number().required(),
            room_nos: Joi.array().items({
                room_no: Joi.number().required(),
                hotel_room_id: Joi.string().required(),
                room_type_id: Joi.string().required(),
                isBooked: Joi.number().valid(0,1).required()
            }).required()
        }).required()
    }), 
    // vendors //
    event_vendors : Joi.array().items({
        _id: Joi.string(),
        vendor_name: Joi.string().min(3).required().trim(),
        vendor_work: Joi.string().min(3).required(),
        vendor_mobile: Joi.string().regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
        reason_for_blacklist: Joi.string().min(3),
        blacklisted: Joi.boolean(),
        scope_of_work: Joi.string().min(3),
        due_amount: Joi.string(),
        paid_amount: Joi.string(),
        total_package: Joi.string(),
        arriving_time: Joi.string()
    }),
    // food bev
    event_foodbev: Joi.array().items({
        _id: Joi.string(),
        food_type: Joi.string().required(),
        menu: Joi.array().items({
             // _id: false,
             file: Joi.string()
        }).required(),
        serve_date: Joi.date().required(),
        serve_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
        .messages({'string.pattern.base': `Time should be in 24 hrs format.`}).required(),
        serve_end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
        .messages({'string.pattern.base': `Time should be in 24 hrs format.`}).required(),
        plates_guaranteed: Joi.string().trim(),
        plates_added: Joi.string().trim(),
        plates_remaining: Joi.string().trim(),
        plates_used: Joi.string().trim()
    }),
   
    // vendor prod //
    event_proddecor: Joi.array().items({
        _id: Joi.string(),
        decor_title: Joi.string().min(3).required(),
        decor_img: Joi.array().items({
             // _id: false,
             file: Joi.string()
        }).required(),
        decor_remark: Joi.string().min(3),
        decor_date: Joi.date().required(),
        expected_decor_time: Joi.string()
    }),
    id: Joi.string()
})

router.post('/update_single_event/:id', auth, checkPermission('update-event'), requestValidator(singleEventValidation), async(req, res) => {
    try {

        const { status, ...data} = await eventService.updateSingleEvent(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/uploadfiles', auth, checkPermission('create-event'), fileUploads('img_files'), async(req, res) => {
    try {
        if(!req.files) {
            return res.status(400).send({msgText: 'File is required', success:false})
        }
        const files = await fileService.uploadMultiple(req.files);
        if(!files.length > 0 ){
            return res.status(400).send({msgText: 'File key is incorrect', success:false})
        }
        res.status(201).send({ files, success: true });
    } catch (error) {
        logger('ADMIN_EVENT-DECORIMG-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, checkPermission('delete-event'),async (req, res) => {
    try {
        const { status, ...data} = await eventService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;