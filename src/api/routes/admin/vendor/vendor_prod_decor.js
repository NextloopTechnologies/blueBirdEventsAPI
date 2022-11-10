import { Router } from "express";
import { auth, requestValidator, fileUploads } from '../../../middlewares';
import { vendorProdDecorService, fileService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';
const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorService.read();
        if(data.vendorproddecor){
            data.vendorproddecor = await fileService.getFileUrl(data.vendorproddecor,'prod_decor_img');
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
    prod_decor_checklist_id: Joi.string().required(),
    prod_decor_img: Joi.string(),
    note: Joi.string().required(),
    id: Joi.string()
});

router.post('/create', auth, fileUploads('prod_decor_img'), requestValidator(vendorProdDecorValidation), async(req, res) => {
    try {
        if(req.files.length === 0) {
            throw {status: 401, msgText: 'File is required', success:false}
        }
        const files = await fileService.uploadMultiple(req.files);
        req.values.prod_decor_img = files;
        const { status, ...data} = await vendorProdDecorService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await vendorProdDecorService.read({_id});
        if(data.vendorproddecor){
            data.vendorproddecor = await fileService.getFileUrl(data.vendorproddecor,'prod_decor_img');
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, fileUploads('prod_decor_img'), requestValidator(vendorProdDecorValidation), async(req, res) => {
    try {
        if(req.files.length > 0) {
            const files = await fileService.uploadMultiple(req.files);
            req.values.prod_decor_img = files;
        }
        const { status, ...data} = await vendorProdDecorService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_VENDORPRODDECOR-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await vendorProdDecorService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;