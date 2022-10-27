import { Router } from "express";
import { offerBannerService , fileService, assignedPermissionService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import logger from "../../../loaders/logger";
import Joi from 'joi';
import { auth, requestValidator, fileUploads } from "../../middlewares";
import mongoose from "mongoose";
const router = new Router();

router.get('', async(req, res) => {
    try {
        let { status, ...data} = await offerBannerService.read();
        data.offerbanner = await fileService.getFileUrl(data.offerbanner,'banner_img',1);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_OFFERBANNER-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const offerBannerValidation = Joi.object({
    banner_title: Joi.string().min(6).trim().required(),
    banner_descp: Joi.string().min(10).required(),
    event_id: Joi.string().required(),
    offer_starts: Joi.date().greater('now').required().messages({
        'date.greater': `"offer_starts" should be greater than todays date`
    }),
    offer_ends: Joi.date().greater(Joi.ref('offer_starts')).required().messages({
        'date.greater': `"offer_ends" should be greater than offer_starts date`
    }),
    banner_img: Joi.string(),
    price: Joi.number().required(),
    discount: Joi.string().required(),
    id: Joi.string(),
    active: Joi.boolean()
});

router.post('/create', auth, fileUploads('banner_img', 1), requestValidator(offerBannerValidation), async(req, res) => {
    try {
        
        if(!req.file) {
            throw {status: 401, msgText: 'File is required', success:false}
        }
        const { fileName } = await fileService.uploadSingle(req.file);
        req.values.banner_img = fileName;
        const { status, ...data} = await offerBannerService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_OFFERBANNER-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const roleId = mongoose.Types.ObjectId('634feb844a6799669e161a81');
        await assignedPermissionService.checkPermission(roleId,'update-offerbanner');
        const _id = req.params.id;
        const { status, ...data} = await offerBannerService.read({_id});
        data.offerbanner = await fileService.getFileUrl(data.offerbanner,'banner_img',1);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_OFFERBANNER-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, fileUploads('banner_img', 1), requestValidator(offerBannerValidation), async(req, res) => {
    try {
        if(req.file) {
            const { imageName } = await fileService.upload(req.file);
            req.values.banner_img = imageName;
        }
        const { status, ...data} = await offerBannerService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_OFFERBANNER-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await offerBannerService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;