import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { hotelRoomService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const hotelRoomValidation = Joi.object({
    hotel_id: Joi.string().required(),
    room_no: Joi.number().required(),
    floor_no: Joi.number().required(),
    room_type: Joi.string().required(),
    booked_from: Joi.date().greater('now').required().messages({
      'date.greater': `"booked_from" should be greater than todays date`
    }),
    booked_to: Joi.date().greater(Joi.ref('booked_from')).required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(hotelRoomValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await hotelRoomService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(hotelRoomValidation), async(req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_HOTELROOM-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await hotelRoomService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;