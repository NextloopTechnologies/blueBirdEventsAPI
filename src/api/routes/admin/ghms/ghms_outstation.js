import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { ghmsOutstationService, filterService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.post('', auth, async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await ghmsOutstationService.read({page, perPage, whereClause});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSOUTSTATION-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsOutstationValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    arrival_location: Joi.string().min(3).required(),
    date_and_time: Joi.date().min(todaysDate).required(),
    notes: Joi.string().min(3).allow(''),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(ghmsOutstationValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsOutstationService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSOUTSTATION-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsOutstationService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSOUTSTATION-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(ghmsOutstationValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsOutstationService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSOUTSTATION-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await ghmsOutstationService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;