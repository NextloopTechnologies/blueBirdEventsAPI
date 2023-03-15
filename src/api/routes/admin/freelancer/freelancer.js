import { Router } from "express";
import { auth, requestValidator, fileUploads,checkPermission } from '../../../middlewares';
import { freelancerService , fileService } from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-freelancer'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await freelancerService.read({ page, perPage });
        if(data.freelancer) {
            data.freelancer = await fileService.getFileUrl(data.freelancer,'pass_size_pic',1);
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCER-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const freelancerValidation = Joi.object({
    name: Joi.string().min(3).trim().required(),
    wa_contact_no: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    alt_contact_no: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    department_type: Joi.string().required(),
    gender: Joi.string().valid('Male','Female').required(),
    city: Joi.string().min(3).required(),
    current_city: Joi.string().min(3).required(),
    experience: Joi.string().required(),
    tshirt_size: Joi.string().required(),
    course: Joi.string().valid('Yes','No').required(),
    coordination: Joi.string().valid('Yes','No').required(),
    work_of_shadow: Joi.string().valid('Yes','No').required(),
    pass_size_pic: Joi.string(),
    id: Joi.string()
});

router.post('/create', fileUploads('pass_size_pic',1), requestValidator(freelancerValidation), async(req, res) => {
    try {
        if(!req.file) {
            throw {status: 401, msgText: 'File is required', success:false}
        }
        const { fileName } = await fileService.uploadSingle(req.file);
        req.values.pass_size_pic = fileName;
        const { status, ...data} = await freelancerService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCER-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-freelancer'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await freelancerService.read({whereClause:{_id}});
        if(data.freelancer) {
            data.freelancer = fileService.getFilename(data.freelancer,'pass_size_pic',1);
            data.freelancer = await fileService.getFileUrl(data.freelancer,'pass_size_pic',1);
        }
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCER-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-freelancer'), fileUploads('pass_size_pic',1), requestValidator(freelancerValidation), async(req, res) => {
    try {
        console.log("before s3", req.file);
        if(req.file) {
            const { fileName } = await fileService.uploadSingle(req.file);
            req.values.pass_size_pic = fileName;
        }
        console.log("From update Freelancer after s3",req.values);
        const { status, ...data} = await freelancerService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCER-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-freelancer'), async (req, res) => {
    try {
        const { status, ...data} = await freelancerService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;