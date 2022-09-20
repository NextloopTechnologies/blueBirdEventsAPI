import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { enquiryService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await enquiryService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ENQUIRY-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const enquiryValidation = Joi.object({
    first_name: Joi.string().min(6).max(60).trim().required(),
    second_name: Joi.string().min(10).required(),
    event_id: Joi.string().required(),
    event_date: Joi.date().greater('now').required().messages({
        'date.greater': `"event_date" should be greater than todays date`
    }),
    venue: Joi.string().trim().required(),
    city_town: Joi.string().trim().required(),
    mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    ref_from: Joi.string().trim(),
    id: Joi.string(),
    active: Joi.boolean()
});

router.post('/create', auth, requestValidator(enquiryValidation), async(req, res) => {
    try {
        const { status, ...data} = await enquiryService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ENQUIRY-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await enquiryService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ENQUIRY-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

// router.post('/update/:id', auth, requestValidator(eventValidation), async(req, res) => {
//     try {
//         const { status, ...data} = await eventService.update(req.params.id,req.body);
//         res.status(status).send(data);
//     } catch (error) {
//         console.log(error);
//         const { status, ...data } = formatFormError(error);
//         res.status(status).send(data);
//     }
// });

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await enquiryService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;