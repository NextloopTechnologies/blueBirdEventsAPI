import { Router } from "express";
import { auth, requestValidator, fileUploads } from '../../middlewares';
import { eventService, fileService} from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', async(req, res) => {
    try {
        const { status, ...data} = await eventService.read();
        data.event = await fileService.getFileUrl(data.event,'event_img',1);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
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

router.post('/create', auth, fileUploads('event_img',1), requestValidator(eventValidation), async(req, res) => {
    try {
        if(!req.file) {
            throw {status: 401, msgText: 'File is required', success:false}
        }
        const { fileName } = await fileService.uploadSingle(req.file);
        req.values.event_img = fileName;
        const { status, ...data} = await eventService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await eventService.read({_id});
        data.event = await fileService.getFileUrl(data.event,'event_img',1);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, fileUploads('event_img',1), requestValidator(eventValidation), async(req, res) => {
    try {
        if(req.file) {
            const { fileName } = await fileService.uploadSingle(req.file);
            req.values.event_img = fileName;
        }
        const { status, ...data} = await eventService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_EVENT-READALL-CONTROLLER').error(error);
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