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

router.get('/teamsheet/:id', async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        
        const { status, ...data} = await eventService.readTeamSheet(page, perPage, req.params.id);
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
        is_hospitality_checklist_visible: Joi.boolean().required(),
        single_event_comments: Joi.string().min(3),
        hotels: Joi.array().items({
            hotel_id: Joi.string().required(),
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
        event_vendors : Joi.object({
            vendors: Joi.array().items({
                vendor_name: Joi.string().min(3).required().trim(),
                vendor_work: Joi.string().min(3).required(),
                vendor_mobile: Joi.string().regex(/^[0-9]{10}$/)
                .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
                scope_of_work: Joi.string().min(3),
                due_amount: Joi.string(),
                paid_amount: Joi.string(),
                total_package: Joi.string(),
                arriving_time: Joi.string()
            }).required()
        }),
        event_foodbev: Joi.array().items({
            food_type: Joi.string().required(),
            menu: Joi.array().items({
                file: Joi.string()
            }).required(),
            serve_date: Joi.date().min(todaysDate).required(),
            serve_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
            .messages({'string.pattern.base': `Time should be in 24 hrs format.`}),
            serve_end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
            .messages({'string.pattern.base': `Time should be in 24 hrs format.`}),
            plates_guaranteed: Joi.string().trim(),
            plates_added: Joi.string().trim(),
            plates_remaining: Joi.string().trim(),
            plates_used: Joi.string().trim()
        }),
        event_proddecor: Joi.array().items({
            decor_title: Joi.string().min(3),
            decor_img: Joi.array().items({
                file: Joi.string()
            }).required(),
            decor_remark: Joi.string().min(3),
            decor_date: Joi.date().min(todaysDate),
            expected_decor_time: Joi.string()
        })
    }).required(),
    ghms: Joi.object({
        guestlist: Joi.array().items({
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_name: Joi.string().min(3).required().trim(),
            guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
            .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
            guest_outstation: Joi.string().valid('Local','Outstation').required(),
            digital_invitation: Joi.boolean().required(),
            notes: Joi.string().min(3).trim().required(),
            // guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).trim(),
            // guest_add: Joi.string().min(3),
            // guest_invited: Joi.string().valid('Individual','Family').required(),
            // guest_expected_nos: Joi.number(),
            // guest_invitation_type: Joi.valid('Courier','Personally','Digitally'),
            // guest_date_of_arrival: Joi.date().min(todaysDate)
        }),
    }),
    // priortization: Joi.array().items({
    //     _id: Joi.string(),
    //     client_id: Joi.string(),
    //     event_id: Joi.string(),
    //     title: Joi.string().min(3).trim().required(),
    //     descp: Joi.string().min(3).trim(),
    //     deadline_date: Joi.date().min(todaysDate).required(),
    //     contact: Joi.string().regex(/^[0-9]{10}$/)
    //     .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    // }),
    checklist: Joi.object({
        client_id: Joi.string(),
        event_id: Joi.string(),
        general_checklist: Joi.array().items({
            checklist: Joi.array().items({
                check_id: Joi.number().required(),
                check_name: Joi.string().required()
            }),  
            checklist_type: Joi.string().valid('Prod','Food','L&C').required(),
            generalchecklist_text: Joi.string().min(3),
            generalchecklist_date: Joi.date().min(todaysDate),
        })
    }).required(),
    // gallery: Joi.object({
    //     _id: Joi.string(),
    //     event_id: Joi.string(),
    //     event_date: Joi.date(),
    //     ep_title: Joi.string().min(3).required(),
    //     ep_descp: Joi.string().min(3).required(),
    //     ep_img: Joi.array().items({
    //         // _id: false,
    //         file: Joi.string()
    //     }).required()
    // }),
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
    is_hospitality_checklist_visible: Joi.boolean().required(),
    single_event_comments: Joi.string().min(3),
    // hotel //
    hotels: Joi.array().items({
        hotel_id: Joi.string().required(),
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
    event_vendors : Joi.object({
        vendors: Joi.array().items({
            _id: Joi.string(),
            vendor_name: Joi.string().min(3).required().trim(),
            vendor_work: Joi.string().min(3).required(),
            vendor_mobile: Joi.string().regex(/^[0-9]{10}$/)
            .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
            scope_of_work: Joi.string().min(3),
            due_amount: Joi.string(),
            paid_amount: Joi.string(),
            total_package: Joi.string(),
            arriving_time: Joi.string()
        }),
        // cars: Joi.array().items({
        //     _id: Joi.string(),
        //     vendor_id: Joi.string().required(),
        //     owner_name: Joi.string().min(3).trim().required(),
        //     car_model: Joi.string().min(3).required(),
        //     car_reg: Joi.string().min(3).required(),
        //     car_number: Joi.string().min(3).required(),
        //     car_type: Joi.string().valid('Rental','Private').required(),
        //     driver_name: Joi.string().min(3).required().trim(),
        //     driver_mobile: Joi.string().regex(/^[0-9]{10}$/)
        //     .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        // })
    }),
    // food bev
    event_foodbev: Joi.array().items({
        _id: Joi.string(),
        food_type: Joi.string().required(),
        menu: Joi.array().items({
            file: Joi.string()
        }).required(),
        serve_date: Joi.date().required(),
        serve_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
        .messages({'string.pattern.base': `Time should be in 24 hrs format.`}),
        serve_end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
        .messages({'string.pattern.base': `Time should be in 24 hrs format.`}),
        plates_guaranteed: Joi.string().trim(),
        plates_added: Joi.string().trim(),
        plates_remaining: Joi.string().trim(),
        plates_used: Joi.string().trim()
    }),
   
    // vendor prod //
    event_proddecor: Joi.array().items({
        _id: Joi.string(),
        decor_title: Joi.string().min(3),
        decor_img: Joi.array().items({
             file: Joi.string()
        }).required(),
        decor_remark: Joi.string().min(3),
        decor_date: Joi.date(),
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