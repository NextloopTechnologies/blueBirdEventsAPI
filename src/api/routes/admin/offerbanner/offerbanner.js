import { Router } from "express";
import { offerBannerService , fileService } from "../../../../services";
import { formatFormError, todaysDate } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';
import { auth, requestValidator, fileUploads, checkPermission } from "../../../middlewares";
const router = new Router();

router.get('', async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await offerBannerService.read({ page, perPage });
        if(data.offerbanner){
            data.offerbanner = await fileService.getFileUrl(data.offerbanner,'banner_img',1);
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_OFFERBANNER-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const offerBannerValidation = Joi.object({
    banner_title: Joi.string().min(3).trim().required(),
    banner_descp: Joi.string().min(3).required(),
    event_type: Joi.string().required(),
    offer_starts: Joi.date().min(todaysDate).required(),
    offer_ends: Joi.date().greater(Joi.ref('offer_starts')).required(),
    banner_img: Joi.string(),
    price: Joi.number().required(),
    discount: Joi.string().required(),
    id: Joi.string(),
    active: Joi.boolean()
});

router.post('/create', auth, checkPermission('create-offerbanner'),  fileUploads('banner_img', 1), requestValidator(offerBannerValidation), async(req, res) => {
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

router.get('/read/:id', auth, checkPermission('read-offerbanner'),  async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await offerBannerService.read({whereClause:{_id}});
        if(data.offerbanner){
            data.offerbanner = await fileService.getFileUrl(data.offerbanner,'banner_img',1);
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_OFFERBANNER-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-offerbanner'), fileUploads('banner_img', 1), requestValidator(offerBannerValidation), async(req, res) => {
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

router.post('/delete', auth, checkPermission('delete-offerbanner'),  async (req, res) => {
    try {
        const { status, ...data} = await offerBannerService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;