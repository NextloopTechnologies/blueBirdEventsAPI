import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { ghmsDepartureMgmtService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsDepartureMgmtValidation = Joi.object({
    sub_event_id: Joi.string().required(),
    client_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    vendor_id: Joi.string().required(),
    car_id: Joi.string().required(),
    driver_id: Joi.string().required(),
    departure_time: Joi.string().required(),
    mode_of_departure: Joi.string().required(),
    dropped_by: Joi.string().valid('BBE','Own').required(),
    return_checklist: Joi.string().required(),
    no_of_guest_arrived: Joi.number().required(),
    special_note: Joi.string().required(),
    date_of_departure: Joi.date().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(ghmsDepartureMgmtValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsDepartureMgmtService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(ghmsDepartureMgmtValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;