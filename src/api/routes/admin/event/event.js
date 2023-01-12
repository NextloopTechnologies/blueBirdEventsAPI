import { Router } from "express";
import { auth, requestValidator, fileUploads, checkPermission } from '../../../middlewares';
import { eventService, fileService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await eventService.readAll({ page, perPage });
        // const defaultProdFiles =  data.event[0].event_proddecor[0].prod_decor_id;
        // const miscellaneousProdFiles = data.event[0].event_proddecor[0].decor_img;
        // console.log(data.event[0].event_proddecor);
        // if(defaultProdFiles.decor_img) {
        //     defaultProdFiles = await fileService.getFileUrl(defaultProdFiles,'decor_img');
        // }
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
        client_id: Joi.string().required(),
        event_type: Joi.string().required(),
        event_title: Joi.string().min(6).max(60).trim().required(),
        event_descp: Joi.string().min(10).required(),
        event_start_date: Joi.date().greater('now').required().messages({
            'date.greater': `"event_start_date" should be greater than todays date`
        }).required(),
        event_end_date: Joi.date().greater(Joi.ref('event_start_date')),
        event_remark: Joi.string(),
        prod_decor_note: Joi.string(),
        // hotel //
        hotel_id: Joi.string().required(),
        hotel_rooms_required: Joi.array().items({
            floor_no: Joi.number().required(),
            room_nos: Joi.array().required()
        }), 
        // vendors //
        event_vendors : Joi.array().items({
            vendor_id: Joi.string().required(),
            scope_of_work: Joi.string(),
            due_amount: Joi.string(),
            paid_amount: Joi.string(),
            total_package: Joi.string(),
            arriving_time: Joi.string()
        }),
        // vendor car //
        event_car: Joi.array(),
        // food bev
        event_foodbev: Joi.array().items({
            food_type: Joi.string().required(),
            menu: Joi.array().items({
                food_sub_type: Joi.string(),
                dish_name: Joi.array()
            }),
            serve_date: Joi.date().greater('now').required().messages({
                'date.greater': `"serve_date" should be greater than todays date`
            }).required(),
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
            prod_decor_id: Joi.string(), 
            isMiscellaneous: Joi.boolean(),
            decor_title: Joi.string(),
            decor_img: Joi.string(),
            decor_date: Joi.date().greater('now').required().messages({
                'date.greater': `"decor_date" should be greater than todays date`
            }),
            expected_decor_time: Joi.string()
        })
    }),
    ghms: Joi.object({
        guestlist: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_name: Joi.string().min(3).max(30).required().trim(),
            guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).required().trim(),
            guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
            .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
            guest_add: Joi.string().required(),
            guest_outstation: Joi.string().valid('Local','Outstation').required(),
            guest_invited: Joi.string().valid('Individual','Family'),
            guest_expected_nos: Joi.number(),
            guest_invitation_type: Joi.valid('Courier','Personally','Digitally'),
            guest_date_of_arrival: Joi.date().greater('now').messages({
            'date.greater': `"guest_date_arrival" should be greater than todays date`
            }),
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
            welcome_checklist: Joi.string().required(),
            no_of_guest_arrived: Joi.number().required(),
            special_note: Joi.string().required(),
            date_of_arrival: Joi.date().required(),
        }),
        departure: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_id: Joi.string().required(),
            car_id: Joi.string().required(),
            departure_time: Joi.string().required(),
            mode_of_departure: Joi.string().required(),
            return_checklist: Joi.string().required(),
            no_of_guest_arrived: Joi.number().required(),
            special_note: Joi.string().required(),
            date_of_departure: Joi.date().required(),
        }),
        roomallotment: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            hotel_room_id: Joi.string().required(),
            guest_id: Joi.string().required(), 
        }),
        lostandfound: Joi.array().items({
            _id: Joi.string(),
            client_id: Joi.string(),
            event_id: Joi.string(),
            guest_id: Joi.string().required(),
            item_name: Joi.string().required(),
            item_identification: Joi.string().required(),
            lost_place: Joi.string().required(),
            found_place: Joi.string().required(),
            found_by: Joi.string().required(),
            deliver_type: Joi.string().required(),
        })
    }),
    checklist: Joi.object({
        _id: Joi.string(),
        client_id: Joi.string(),
        event_id: Joi.string(),
        general_checklist: Joi.array().items({
            checklist: Joi.array().items({
                check_id: Joi.number().required(),
                check_name: Joi.string().required()
            }),  
            checklist_type: Joi.string().valid('Prod','Food','L&C').required(),
            generalchecklist_text: Joi.string(),
            generalchecklist_date: Joi.date().greater('now').messages({
                'date.greater': `"date" should be greater than todays date`
            }),
        })
    })
});

router.post('/create', auth, checkPermission('create-event'), requestValidator(eventValidation), fileUploads('decor_img'),async(req, res) => {
    try {
        // console.log("from files ",req.files);
        // console.log("from req", req.values.checklist)
        // if(!req.file) {
        //     throw {status: 401, msgText: 'File is required', success:false}
        // }
        // const { fileName } = await fileService.uploadSingle(req.file);
        // req.values.event_img = fileName;
        const { status, ...data } = await eventService.create(req.values);
        res.status(status).send(data);
        // res.send('success');
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
        
        // if(data.event){
        //     data.event = await fileService.getFileUrl(data.event,'event_img',1);
        // }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-event'),fileUploads('decor_img'), requestValidator(eventValidation), async(req, res) => {
    try {
        // if(req.file) {
        //     const { fileName } = await fileService.uploadSingle(req.file);
        //     req.values.event_img = fileName;
        // }
        const { status, ...data} = await eventService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-event'),async (req, res) => {
    try {
        const { status, ...data} = await eventService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;