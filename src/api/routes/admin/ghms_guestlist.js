import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { ghmsGuestlistService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsGuestlistValidation = Joi.object({
    sub_event_id: Joi.string().required(),
    guest_name: Joi.string().min(3).max(30).required().trim(),
    guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).required().trim(),
    guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    guest_add: Joi.string().min(10).required(),
    guest_invited: Joi.string().valid('Individual','Family').required(),
    guest_outstation: Joi.string().valid('Local','Outstation').required(),
    guest_expected_nos: Joi.number().required(),
    guest_invitation_type: Joi.valid('Courier','Personally','Digitally').required(),
    guest_date_of_arrival: Joi.date().greater('now').required().messages({
      'date.greater': `"guest_date_arrival" should be greater than todays date`
    }),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(ghmsGuestlistValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsGuestlistService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(ghmsGuestlistValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;