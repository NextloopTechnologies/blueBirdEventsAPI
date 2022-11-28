import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { subEventService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', async(req, res) => {
    try {
        const { status, ...data} = await subEventService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const subEventValidation = Joi.object({
    subevent_title: Joi.string().min(6).max(60).trim().required(),
    subevent_descp: Joi.string().min(10).required(),
    subevent_date: Joi.date().required(),
    event_id: Joi.string().required(),
    hotel_id: Joi.string().required(),
    hotel_rooms_required: Joi.array().items({
        floor_no: Joi.number().required(),
        room_nos: Joi.array().required()
    }),  
    client_id: Joi.string().required(),
    prod_decor_id: Joi.string(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(subEventValidation), async(req, res) => {
    try {
        const { status, ...data} = await subEventService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await subEventService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(subEventValidation), async(req, res) => {
    try {
        const { status, ...data} = await subEventService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await subEventService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;