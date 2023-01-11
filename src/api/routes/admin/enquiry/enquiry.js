import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { enquiryService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-enquiry'),async(req, res) => {
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
    first_name: Joi.string().min(3).max(30).trim().required(),
    second_name: Joi.string().min(3).max(30).trim().required(),
    wedding_of: Joi.string().required(),
    event_type: Joi.string().required(),
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

router.post('/create', requestValidator(enquiryValidation), async(req, res) => {
    try {
        const { status, ...data} = await enquiryService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ENQUIRY-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-enquiry'), async (req, res)=> {
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

router.post('/delete', auth, checkPermission('delete-enquiry'), async (req, res) => {
    try {
        const { status, ...data} = await enquiryService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;