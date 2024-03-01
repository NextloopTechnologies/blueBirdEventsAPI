import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { ghmsDepartureMgmtService, filterService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.post('', auth, checkPermission('manage-ghmsdeparture'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await ghmsDepartureMgmtService.read({page, perPage, whereClause});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsDepartureMgmtCreateValidtn = Joi.object({
    event_id: Joi.string().required(),
    client_id: Joi.string().required(),
    car_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    departure_time: Joi.string().required(),
    mode_of_departure: Joi.string().required(),
    return_checklist: Joi.string().allow(''),
    // no_of_guest_arrived: Joi.number().required(),
    special_note: Joi.string().allow(''),
    date_of_departure: Joi.date().min(todaysDate).required()
});

router.post('/create', auth, checkPermission('create-ghmsdeparture'), requestValidator(ghmsDepartureMgmtCreateValidtn), async(req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-ghmsdeparture'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsDepartureMgmtService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsDepartureMgmtUpdateValidtn = Joi.object({
    event_id: Joi.string().required(),
    client_id: Joi.string().required(),
    car_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    departure_time: Joi.string().required(),
    mode_of_departure: Joi.string().required(),
    return_checklist: Joi.string().allow(''),
    // no_of_guest_arrived: Joi.number().required(),
    special_note: Joi.string().allow(''),
    date_of_departure: Joi.date().required(),
    id: Joi.string()
});

router.post('/update/:id', auth, checkPermission('update-ghmsdeparture'), requestValidator(ghmsDepartureMgmtUpdateValidtn), async(req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSDEPARTUREMGMT-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-ghmsdeparture'), async (req, res) => {
    try {
        const { status, ...data} = await ghmsDepartureMgmtService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;