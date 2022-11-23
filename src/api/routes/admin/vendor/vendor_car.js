import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { vendorCarService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await vendorCarService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorCarValidation = Joi.object({
  vendor_id: Joi.string().required(),
  car_name: Joi.string().min(3).max(20).trim().required(),
  car_model: Joi.string().required(),
  car_number: Joi.string().required(),
  id: Joi.string()
});

router.post('/create', auth, requestValidator(vendorCarValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorCarService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorCarService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(vendorCarValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorCarService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORCAR-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await vendorCarService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;