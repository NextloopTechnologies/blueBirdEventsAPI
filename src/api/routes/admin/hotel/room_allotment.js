import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { roomAllotmentService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const roomAllotmentValidation = Joi.object({
    client_id: Joi.string().required(),
    sub_event_id: Joi.string().required(),
    hotel_room_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    remarks: Joi.string().min(10).required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(roomAllotmentValidation), async(req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await roomAllotmentService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(roomAllotmentValidation), async(req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;