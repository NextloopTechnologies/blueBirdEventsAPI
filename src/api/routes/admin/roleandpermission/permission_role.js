import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { permissionRoleService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-permissionrole'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await permissionRoleService.read({ page, perPage });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const permRoleValidation = Joi.object({
    permission_id: Joi.string().required(),
    role_id: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-permissionrole'), requestValidator(permRoleValidation), async(req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-permissionrole'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await permissionRoleService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-permissionrole'), requestValidator(permRoleValidation), async(req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-permissionrole'), async (req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;