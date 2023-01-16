import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { ghmsArrivalMgmtService, filterService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-ghmsarrival'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await ghmsArrivalMgmtService.read({ page, perPage, whereClause});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsArrivalMgmtValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    car_id: Joi.string().required(),
    arrived_at: Joi.string().required(),
    mode_of_arrival: Joi.string().required(),
    expected_arrival_time: Joi.string().required(),
    welcome_checklist: Joi.string().min(3),
    no_of_guest_arrived: Joi.number().required(),
    special_note: Joi.string().min(3),
    date_of_arrival: Joi.date().min(todaysDate).required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-ghmsarrival'), requestValidator(ghmsArrivalMgmtValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsArrivalMgmtService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-ghmsarrival'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsArrivalMgmtService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-ghmsarrival'), requestValidator(ghmsArrivalMgmtValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsArrivalMgmtService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-ghmsarrival'), async (req, res) => {
    try {
        const { status, ...data} = await ghmsArrivalMgmtService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;