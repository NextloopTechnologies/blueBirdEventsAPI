import { Router } from "express";
import { auth, checkPermission, requestValidator } from '../../../middlewares';
import { priortizationListService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-priortizationlist'),  async(req, res) => {
    try {
        const { status, ...data} = await priortizationListService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const priortizationListValidation = Joi.object({
    client_id: Joi.string().required(),
    sub_event_id: Joi.string().required(),
    title: Joi.string().trim().required(),
    descp: Joi.string().trim(),
    deadline_date: Joi.date().greater('now').required().messages({
      'date.greater': `"serve_date" should be greater than todays date`
    }).required(),
    contact: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-priortizationlist'), requestValidator(priortizationListValidation), async(req, res) => {
    try {
        const { status, ...data} = await priortizationListService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-priortizationlist'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await priortizationListService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-priortizationlist'), requestValidator(priortizationListValidation), async(req, res) => {
    try {
        const { status, ...data} = await priortizationListService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PRIORTIZATIONLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-priortizationlist'),  async (req, res) => {
    try {
        const { status, ...data} = await priortizationListService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;