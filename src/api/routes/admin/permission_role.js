import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { permissionRoleService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.read();
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

router.post('/create', auth, requestValidator(permRoleValidation), async(req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await permissionRoleService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(permRoleValidation), async(req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_PERMISSION_ROLE-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await permissionRoleService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;