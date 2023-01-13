import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { vendorCarService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-vendorcar'),  async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await vendorCarService.read({ page, perPage })
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorCarValidation = Joi.object({
    vendor_id: Joi.string().required(),
    owner_name: Joi.string().min(3).trim().required(),
    car_model: Joi.string().required(),
    car_reg: Joi.string().required(),
    car_number: Joi.string().required(),
    car_type: Joi.string().valid('Rental','Private').required(),
    driver_name: Joi.string().min(3).required().trim(),
    driver_mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-vendorcar'),  requestValidator(vendorCarValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorCarService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-vendorcar'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorCarService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-vendorcar'),  requestValidator(vendorCarValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorCarService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-vendorcar'),  async (req, res) => {
    try {
        const { status, ...data} = await vendorCarService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;