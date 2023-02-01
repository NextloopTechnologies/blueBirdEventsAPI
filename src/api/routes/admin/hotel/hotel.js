import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { hotelService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-hotel'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await hotelService.read({ page, perPage });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const hotelValidation = Joi.object({
    hotel_name: Joi.string().min(3).trim().required(),
    hotel_mob: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    hotel_add : Joi.string().min(3).required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-hotel'), requestValidator(hotelValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-hotel'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-hotel'), requestValidator(hotelValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-hotel'), async (req, res) => {
    try {
        const { status, ...data} = await hotelService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;