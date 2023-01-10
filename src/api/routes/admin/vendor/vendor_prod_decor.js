import { Router } from "express";
import { auth, requestValidator, fileUploads, checkPermission } from '../../../middlewares';
import { vendorProdDecorService, fileService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';
const router = new Router();

router.get('', auth, checkPermission('manage-vendorproddecor'),  async(req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorService.read();
        if(data.vendorproddecor){
            data.vendorproddecor = await fileService.getFileUrl(data.vendorproddecor,'decor_img');
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const vendorProdDecorValidation = Joi.object({
    vendor_id: Joi.string().required(),
    decor_img: Joi.string(),
    decor_title: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-vendorproddecor'),  fileUploads('decor_img'), requestValidator(vendorProdDecorValidation), async(req, res) => {
    try {
        if(req.files.length === 0) {
            throw {status: 401, msgText: 'File is required', success:false}
        }
        const files = await fileService.uploadMultiple(req.files);
        req.values.decor_img = files;
        const { status, ...data} = await vendorProdDecorService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-vendorproddecor'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorProdDecorService.read({_id});
        if(data.vendorproddecor){
            data.vendorproddecor = await fileService.getFileUrl(data.vendorproddecor,'decor_img');
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-vendorproddecor'),  fileUploads('decor_img'), requestValidator(vendorProdDecorValidation), async(req, res) => {
    try {
        if(req.files.length > 0) {
            const files = await fileService.uploadMultiple(req.files);
            req.values.decor_img = files;
        }
        const { status, ...data} = await vendorProdDecorService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-vendorproddecor'),  async (req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;