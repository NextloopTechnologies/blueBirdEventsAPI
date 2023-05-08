import { Router } from "express";
import { auth, checkPermission, requestValidator } from '../../../middlewares';
import { priortizationListService, filterService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';
import mongoose from "mongoose";

const router = new Router();

router.post('', auth, checkPermission('manage-priortizationlist'),  async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await priortizationListService.read({ page, perPage, whereClause });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const priortizationListCreateValidtn = Joi.object({
    event_id: Joi.string().required(),
    title: Joi.string().min(3).trim().required(),
    descp: Joi.string().min(3).trim(),
    deadline_date: Joi.date().min(todaysDate).required(),
    contact: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`})
});

router.post('/create', auth, checkPermission('create-priortizationlist'), requestValidator(priortizationListCreateValidtn), async(req, res) => {
    try {
        const { status, ...data} = await priortizationListService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-priortizationlist'), async (req, res)=> {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const _id = req.params.id;
        const { status, ...data} = await priortizationListService.read({page, perPage, whereClause:{_id: new mongoose.Types.ObjectId(_id)}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data)
    }
});

const priortizationListUpdateValidtn = Joi.object({
    event_id: Joi.string().required(),
    title: Joi.string().min(3).trim().required(),
    descp: Joi.string().min(3).trim(),
    deadline_date: Joi.date().required(),
    contact: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    id: Joi.string()
});

router.post('/update/:id', auth, checkPermission('update-priortizationlist'), requestValidator(priortizationListUpdateValidtn), async(req, res) => {
    try {
        const { status, ...data} = await priortizationListService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-priortizationlist'),  async (req, res) => {
    try {
        const { status, ...data} = await priortizationListService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;