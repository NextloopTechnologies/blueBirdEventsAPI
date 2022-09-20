import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { eventService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await eventService.read();
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const eventValidation = Joi.object({
    event_title: Joi.string().min(6).max(60).trim().required(),
    event_descp: Joi.string().min(10).required(),
    event_img: Joi.string(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(eventValidation), async(req, res) => {
    try {
        const { status, ...data} = await eventService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await eventService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(eventValidation), async(req, res) => {
    try {
        const { status, ...data} = await eventService.update(req.params.id,req.body);
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await eventService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;