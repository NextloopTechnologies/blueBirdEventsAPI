import { Router } from "express";
import { auth, requestValidator } from '../../../middlewares';
import { freelancerAssignedEventService} from "../../../../services";
import { formatFormError } from '../../../../utils/helper';
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await freelancerAssignedEventService.read();
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-READALL-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const freelancerAssignedEventValidation = Joi.object({
    client_id: Joi.string().required(),
    sub_event_id: Joi.string().required(),
    freelancer_id: Joi.string().required(),
    department: Joi.string().required(),
    expected_working_hours: Joi.number().required(),
    hours_worked: Joi.number().required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(freelancerAssignedEventValidation), async(req, res) => {
    try {
        const { status, ...data} = await freelancerAssignedEventService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-CREATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await freelancerAssignedEventService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-READ-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(freelancerAssignedEventValidation), async(req, res) => {
    try {
       
        const { status, ...data} = await freelancerAssignedEventService.update(req.params.id,req.values);
        res.status(status).send(data);
    } catch (error) {
        logger('ADMIN_FREELANCERASSIGNEDEVENTSERVICE-UPDATE-CONTROLLER').error(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        const { status, ...data} = await freelancerAssignedEventService.remove(req.body.ids);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;