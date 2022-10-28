import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { hotelRoomTypeService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomTypeService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMTYPE-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const hotelRoomTypeValidation = Joi.object({
    hotel_id: Joi.string().required(),
    room_type_name: Joi.string().required(),
    beds: Joi.string().required(),
    max_occupancy: Joi.number().required(),
    cost_per_night: Joi.number().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(hotelRoomTypeValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomTypeService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMTYPE-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelRoomTypeService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMTYPE-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(hotelRoomTypeValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomTypeService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOMTYPE-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await hotelRoomTypeService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;