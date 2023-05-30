import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { ghmsGuestlistService, filterService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router() ;

router.post('', auth, checkPermission('manage-ghmsguestlist'),  async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await ghmsGuestlistService.read({page, perPage, whereClause});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsGuestlistCreateValidtn = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    guest_name: Joi.string().min(3).required().trim(),
    guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).trim(),
    guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    guest_add: Joi.string().min(3),
    guest_outstation: Joi.string().valid('Local','Outstation').required(),
    guest_invited: Joi.string().valid('Individual','Family').required(),
    guest_expected_nos: Joi.number(),
    guest_invitation_type: Joi.valid('Courier','Personally','Digitally'),
    guest_date_of_arrival: Joi.date().min(todaysDate)
});

router.post('/create', auth, checkPermission('create-ghmsguestlist'),  requestValidator(ghmsGuestlistCreateValidtn), async(req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsBulkGuestlistValidation = Joi.object({
    guestlist: Joi.array().items({
        client_id: Joi.string().required(),
        event_id: Joi.string().required(),
        guest_name: Joi.string().min(3).required().trim(),
        guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).trim(),
        guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
        .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
        guest_add: Joi.string().min(3),
        guest_outstation: Joi.string().valid('Local','Outstation').required(),
        guest_invited: Joi.string().valid('Individual','Family'),
        guest_expected_nos: Joi.number(),
        guest_invitation_type: Joi.valid('Courier','Personally','Digitally'),
        guest_date_of_arrival: Joi.date().min(todaysDate),
    })
});

router.post('/createBulk', auth, checkPermission('create-ghmsguestlist'),  requestValidator(ghmsBulkGuestlistValidation), async(req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.createBulk(req.values.guestlist);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-ghmsguestlist'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await ghmsGuestlistService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const ghmsGuestlistUpdateValidtn = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    guest_name: Joi.string().min(3).required().trim(),
    guest_email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).trim(),
    guest_mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    guest_add: Joi.string().min(3),
    guest_outstation: Joi.string().valid('Local','Outstation').required(),
    guest_invited: Joi.string().valid('Individual','Family').required(),
    guest_expected_nos: Joi.number(),
    guest_invitation_type: Joi.valid('Courier','Personally','Digitally'),
    guest_date_of_arrival: Joi.date(),
    id: Joi.string()
});

router.post('/update/:id', auth, checkPermission('update-ghmsguestlist'),  requestValidator(ghmsGuestlistUpdateValidtn), async(req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_GHMSGUESTLIST-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-ghmsguestlist'),  async (req, res) => {
    try {
        const { status, ...data} = await ghmsGuestlistService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;