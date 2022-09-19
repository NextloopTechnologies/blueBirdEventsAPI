import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { eventPhotoService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';
import { fileUploads } from "../../middlewares";
const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await eventPhotoService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENTPHOTO-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const eventPhotoValidation = Joi.object({
    ep_title: Joi.string().min(6).max(60).trim().required(),
    ep_descp: Joi.string().min(10).required(),
    event_id: Joi.string().required(),
    event_date: Joi.date().greater('now').required().messages({
        'date.greater': `"event_date" should be greater than todays date`
    }),
    ep_img: Joi.string(),
    id: Joi.string(),
    active: Joi.boolean()
});

router.post('/create', auth, fileUploads('ep_img'), requestValidator(eventPhotoValidation), async(req, res) => {
    try {
        console.log("from create event ", req.body, req.files);
        const { status, ...data} = await eventPhotoService.create(req.body);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENTPHOTO-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await eventPhotoService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        // console.log(error);
        logger('ADMIN_EVENTPHOTO-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, fileUploads('ep_img'), requestValidator(eventPhotoValidation), async(req, res) => {
    try {
        const { status, ...data} = await eventPhotoService.update(req.params.id,req.body);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENTPHOTO-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await eventPhotoService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;