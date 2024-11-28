import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { ghmsLostFoundService, filterService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.post('', auth, checkPermission('manage-ghmslostfound'),  async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await ghmsLostFoundService.read({page, perPage, whereClause});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsLostFoundValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    lost_item: Joi.string().min(3).required(),
    deliver_type: Joi.string().min(3).required(),
    // item_name: Joi.string().min(3).required(),
    // item_identification: Joi.string().min(3).required(),
    // lost_place: Joi.string().min(3).required(),
    // found_place: Joi.string().min(3).required(),
    // found_by: Joi.string().min(3).required(),
    // deliver_type: Joi.string().valid('Self','Courier').required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-ghmslostfound'),  requestValidator(ghmsLostFoundValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-ghmslostfound'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsLostFoundService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-ghmslostfound'),  requestValidator(ghmsLostFoundValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-ghmslostfound'),  async (req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;