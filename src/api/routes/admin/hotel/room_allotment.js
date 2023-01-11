import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { roomAllotmentService, filterService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-roomallotment'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const whereClause = await filterService.clientOrCoordinatorPanel(req.body);
        const { status, ...data} = await roomAllotmentService.read({page, perPage, whereClause});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const roomAllotmentValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    hotel_room_id: Joi.string().required(),
    guest_id: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-roomallotment'), requestValidator(roomAllotmentValidation), async(req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-roomallotment'), async (req, res)=> {
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

router.post('/update/:id', auth, checkPermission('update-roomallotment'), requestValidator(roomAllotmentValidation), async(req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROOMALLOTMENT-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-roomallotment'), async (req, res) => {
    try {
        const { status, ...data} = await roomAllotmentService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;