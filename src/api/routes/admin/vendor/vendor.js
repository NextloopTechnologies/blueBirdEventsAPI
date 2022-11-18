import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { vendorService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await vendorService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDOR-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorValidation = Joi.object({
    vendor_name: Joi.string().min(3).max(30).required().trim(),
    vendor_work: Joi.string().required(),
    vendor_mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    vendor_scope_of_work: Joi.string().min(5).required().trim(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(vendorValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDOR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDOR-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(vendorValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDOR-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await vendorService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;