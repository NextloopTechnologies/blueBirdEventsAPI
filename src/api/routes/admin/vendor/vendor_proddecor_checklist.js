import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { vendorProdDecorChecklistService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';
const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorChecklistService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECORCHECKLIST-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorProdDecorChecklistValidation = Joi.object({
    vendor_id: Joi.string().required(),
    checklist_name: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(vendorProdDecorChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorChecklistService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECORCHECKLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorProdDecorChecklistService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECORCHECKLIST-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(vendorProdDecorChecklistValidation), async(req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorChecklistService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECORCHECKLIST-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorChecklistService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;