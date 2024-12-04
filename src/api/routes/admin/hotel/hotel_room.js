import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { hotelRoomService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-hotelroom'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await hotelRoomService.readAll({ page, perPage });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const bulkHotelRoomValidation = Joi.object({
    hotelroom: Joi.array().items({
        hotel_id: Joi.string().required(),
        room_no: Joi.number().required(),
        floor_no: Joi.number().required(),
        room_type_id: Joi.string(),
        // booked_from: Joi.date().min(todaysDate),
        // booked_to: Joi.date().greater(Joi.ref('booked_from')),
        hospitality_checklist: Joi.array().items({
            check_id: Joi.number(),
            check_name: Joi.string()
        }),
        is_hospitality_checklist_visible: Joi.boolean().required()
    }).required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-hotelroom'), requestValidator(bulkHotelRoomValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.create(req.values.hotelroom);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-hotelroom'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelRoomService.read(_id);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/checked/:id', auth, checkPermission('read-hotelroom'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelRoomService.readCheckedRoom(_id);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const singleHotelRoomValidation = Joi.object({
    hotel_id: Joi.string().required(),
    room_no: Joi.number().required(),
    floor_no: Joi.number().required(),
    room_type_id: Joi.string(),
    // booked_from: Joi.date().min(todaysDate),
    // booked_to: Joi.date().greater(Joi.ref('booked_from')),
    hospitality_checklist: Joi.array().items({
        check_id: Joi.number(),
        check_name: Joi.string()
    }),
    is_hospitality_checklist_visible: Joi.boolean().required(),
    id: Joi.string()
});

router.post('/update/:id', auth, checkPermission('update-hotelroom'), requestValidator(singleHotelRoomValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update-hotelroom-checklist/:id', auth, checkPermission('update-hotelroom'), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.update(req.params.id,req.body);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMCHECKLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-hotelroom'), async (req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;