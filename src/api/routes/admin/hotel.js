import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { hotelService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', async(req, res) => {
    try {
        const { status, ...data} = await hotelService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const hotelValidation = Joi.object({
    hotel_name: Joi.string().min(6).max(60).trim().required(),
    hotel_mob: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    hotel_add : Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(hotelValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(hotelValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTEL-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await hotelService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;