import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { generalChecklistService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-generalchecklist'), async(req, res) => {
    try {
        const { status, ...data} = await generalChecklistService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('GENERALCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const generalChecklistValidation = Joi.object({
    sub_event_id: Joi.string().required(),
    client_id: Joi.string().required(),
    checklist: Joi.array().items({
      check_id: Joi.number().required(),
      check_name: Joi.string().required()
    }),  
    checklist_type: Joi.string().valid('Prod','Food','L&C').required(),
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
        const { status, ...data} = await generalChecklistService.read({_id});
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