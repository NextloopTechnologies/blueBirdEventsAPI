import { Router } from "express";
import { auth, requestValidator,checkPermission } from '../../../middlewares';
import { vendorFoodBevService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-vendorfoodbev'),  async(req, res) => {
    try {
        const { status, ...data} = await vendorFoodBevService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORFOODBEV-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorFoodBevValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    food_type: Joi.string().trim().required(),
    food_sub_type: Joi.string().trim().required(),
    dish_name: Joi.string().trim().required(),
    plates_guaranteed: Joi.string().trim(),
    plates_added: Joi.string().trim(),
    plates_remaining: Joi.string().trim(),
    plates_used: Joi.string().trim(),
    serve_date: Joi.date().greater('now').required().messages({
      'date.greater': `"serve_date" should be greater than todays date`
    }).required(),
    serve_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
    .messages({'string.pattern.base': `Time should be in 24 hrs format.`}).required(),
    serve_end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
    .messages({'string.pattern.base': `Time should be in 24 hrs format.`}).required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-vendorfoodbev'),  requestValidator(vendorFoodBevValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorFoodBevService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORFOODBEV-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-vendorfoodbev'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorFoodBevService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORFOODBEV-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-vendorfoodbev'),  requestValidator(vendorFoodBevValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorFoodBevService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORFOODBEV-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-vendorfoodbev'),  async (req, res) => {
    try {
        const { status, ...data} = await vendorFoodBevService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;