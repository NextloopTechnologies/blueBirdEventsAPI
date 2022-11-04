import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { hotelRoomChecklistService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomChecklistService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const hotelRoomChecklistValidation = Joi.object({
    hotel_id: Joi.string().required(),
    room_type_id: Joi.string().required(),
    checklist_name: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(hotelRoomChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomChecklistService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMCHECKLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelRoomChecklistService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMCHECKLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(hotelRoomChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomChecklistService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMCHECKLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await hotelRoomChecklistService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;