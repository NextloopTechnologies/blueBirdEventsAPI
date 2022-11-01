import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { ghmsLostFoundService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsLostFoundValidation = Joi.object({
    sub_event_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    item_name: Joi.string().required(),
    item_identification: Joi.string().required(),
    lost_place: Joi.string().required(),
    found_place: Joi.string().required(),
    found_by: Joi.string().required(),
    deliver_type: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(ghmsLostFoundValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsLostFoundService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(ghmsLostFoundValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSLOSTFOUND-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await ghmsLostFoundService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;