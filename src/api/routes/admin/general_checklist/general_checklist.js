import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { generalChecklistService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-generalchecklist'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await generalChecklistService.read({ page, perPage });
        res.status(status).send(data);
    } catch (error) {
        logger('GENERALCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const generalChecklistValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    general_checklist: Joi.array().items({
        checklist_type: Joi.string().valid('Prod','Food','L&C').required(),
        generalchecklist_text: Joi.string(),
        generalchecklist_date: Joi.date().min(todaysDate),
        checklist: Joi.array().items({
            check_id: Joi.number().required(),
            check_name: Joi.string().required()
        })
    }),  
   
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-generalchecklist'), requestValidator(generalChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await generalChecklistService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('GENERALCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-generalchecklist'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await generalChecklistService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('GENERALCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-generalchecklist'), requestValidator(generalChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await generalChecklistService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('GENERALCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-generalchecklist'), async (req, res) => {
    try {
        const { status, ...data} = await generalChecklistService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;