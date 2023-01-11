import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { permissionService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-permission'),  async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await permissionService.read({ page, perPage });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const permValidation = Joi.object({
    perm_name: Joi.string().min(4).max(60).trim().required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-permission'),  requestValidator(permValidation), async(req, res) => {
    try {
        const { status, ...data} = await permissionService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-permission'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await permissionService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-permission'),  requestValidator(permValidation), async(req, res) => {
    try {
        const { status, ...data} = await permissionService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-permission'),  async (req, res) => {
    try {
        const { status, ...data} = await permissionService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;