import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { vendorDriverService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await vendorDriverService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORDRIVER-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorDriverValidation = Joi.object({
    client_id: Joi.string().required(),
    sub_event_id: Joi.string().required(),
    driver_name: Joi.string().min(3).max(30).required().trim(),
    driver_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).required().trim(),
    driver_mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(vendorDriverValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorDriverService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORDRIVER-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorDriverService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORDRIVER-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(vendorDriverValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorDriverService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORDRIVER-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await vendorDriverService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;