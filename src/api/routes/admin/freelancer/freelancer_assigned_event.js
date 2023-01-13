import { Router } from "express";
import { auth, requestValidator, checkPermission} from '../../../middlewares';
import { freelancerAssignedEventService} from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, checkPermission('manage-deployedfreelancer'), async(req, res) => {
    try {
        const page = parseInt(req.query.p) || 1
        const perPage = parseInt (req.query.r) || 10
        const { status, ...data} = await freelancerAssignedEventService.read({ page, perPage });
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const freelancerAssignedEventValidation = Joi.object({
    client_id: Joi.string().required(),
    event_id: Joi.string().required(),
    freelancer_id: Joi.string().required(),
    department_type: Joi.string().required(),
    expected_working_hours: Joi.number().required(),
    hours_worked: Joi.number().required(),
    id: Joi.string()
});

router.post('/create', auth, checkPermission('create-deployedfreelancer'), requestValidator(freelancerAssignedEventValidation), async(req, res) => {
    try {
        const { status, ...data} = await freelancerAssignedEventService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, checkPermission('read-deployedfreelancer'), async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await freelancerAssignedEventService.read({whereClause:{_id}});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, checkPermission('update-deployedfreelancer'),requestValidator(freelancerAssignedEventValidation), async(req, res) => {
    try {
       
        const { status, ...data} = await freelancerAssignedEventService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, checkPermission('delete-deployedfreelancer'), async (req, res) => {
    try {
        const { status, ...data} = await freelancerAssignedEventService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;