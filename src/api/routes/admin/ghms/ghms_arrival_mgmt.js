import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { ghmsArrivalMgmtService, filterService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const filterData = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await ghmsArrivalMgmtService.read(filterData);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsArrivalMgmtValidation = Joi.object({
    client_id: Joi.string().required(),
    sub_event_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    car_id: Joi.string().required(),
    arrived_at: Joi.string().required(),
    mode_of_arrival: Joi.string().required(),
    expected_arrival_time: Joi.string().required(),
    welcome_checklist: Joi.string().required(),
    no_of_guest_arrived: Joi.number().required(),
    special_note: Joi.string().required(),
    date_of_arrival: Joi.date().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(ghmsArrivalMgmtValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsArrivalMgmtService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsArrivalMgmtService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(ghmsArrivalMgmtValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsArrivalMgmtService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSARRIVALMGMT-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await ghmsArrivalMgmtService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;