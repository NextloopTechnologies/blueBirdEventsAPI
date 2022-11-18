import { Router } from "express";
import { auth, requestValidator, fileUploads } from '../../../middlewares';
import { eventPhotoService, fileService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';
const router = new Router();

router.get('', async(req, res) => {
    try {
        const { status, ...data} = await eventPhotoService.read();
        if(data.eventphoto) {
            data.eventphoto = await fileService.getFileUrl(data.eventphoto,'ep_img');
        }
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
    sub_event_id: Joi.string().required(),
    event_date: Joi.date().greater('now').required().messages({
        'date.greater': `"event_date" should be greater than todays date`
    }),
    ep_img: Joi.string(),
    id: Joi.string(),
    active: Joi.boolean()
});

router.post('/create', auth, fileUploads('ep_img'), requestValidator(eventPhotoValidation), async(req, res) => {
    try {
        if(req.files.length === 0) {
            throw {status: 401, msgText: 'File is required', success:false}
        }
        const files = await fileService.uploadMultiple(req.files);
        req.values.ep_img = files;
        const { status, ...data} = await eventPhotoService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENTPHOTO-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await eventPhotoService.read({_id});
        if(data.eventphoto){
            data.eventphoto = await fileService.getFileUrl(data.eventphoto,'ep_img');
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENTPHOTO-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, fileUploads('ep_img'), requestValidator(eventPhotoValidation), async(req, res) => {
    try {
        if(req.files.length > 0) {
            const files = await fileService.uploadMultiple(req.files);
            req.values.ep_img = files;
        }
        const { status, ...data} = await eventPhotoService.update(req.params.id,req.values);
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