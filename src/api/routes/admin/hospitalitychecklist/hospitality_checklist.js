import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { hospitalityChecklistService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await hospitalityChecklistService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOSPITALITYCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const hospitalityChecklistValidation = Joi.object({
    client_id: Joi.string().required(),
    sub_event_id: Joi.string().required(),
    hotel_room_id: Joi.string().required(),
    hotel_room_type_id: Joi.string().required(),
    hotel_room_checklist: Joi.array().items({
        checklist_id: Joi.string().required()
    }),
    remarks: Joi.string().min(3).required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(hospitalityChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await hospitalityChecklistService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOSPITALITYCHECKLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hospitalityChecklistService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOSPITALITYCHECKLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(hospitalityChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await hospitalityChecklistService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOSPITALITYCHECKLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await hospitalityChecklistService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;