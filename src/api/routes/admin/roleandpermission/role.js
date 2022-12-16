import { Router } from "express";
import { auth, requestValidator, checkPermission } from '../../../middlewares';
import { roleService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-role'),  async(req, res) => {
    try {
        const { status, ...data} = await roleService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROLE-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const roleValidation = Joi.object({
    role_name: Joi.string().min(4).max(60).trim().required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-role'),  requestValidator(roleValidation), async(req, res) => {
    try {
        const { status, ...data} = await roleService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROLE-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-role'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await roleService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROLE-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-role'),  requestValidator(roleValidation), async(req, res) => {
    try {
        const { status, ...data} = await roleService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_ROLE-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-role'),  async (req, res) => {
    try {
        const { status, ...data} = await roleService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;