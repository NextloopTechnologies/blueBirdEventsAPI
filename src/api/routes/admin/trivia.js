import { Router } from "express";
import { auth, requestValidator } from '../../middlewares';
import { triviaService } from "../../../services";
import { formatFormError } from '../../../utils/helper';
import Joi from 'joi';

const router = new Router();

router.get('', auth, async(req, res) => {
    try {
        const { status, ...data} = await triviaService.read();
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const triviaValidation = Joi.object({
    title: Joi.string().min(6).max(60).trim().required(),
    descp: Joi.string().min(10).required(),
    id: Joi.string()
});

router.post('/create', auth, requestValidator(triviaValidation), async(req, res) => {
    try {
        const { status, ...data} = await triviaService.create(req.values);
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/read/:id', auth, async (req, res)=> {
    try {
        const _id = req.params.id;
        const { status, ...data} = await triviaService.read({_id});
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/update/:id', auth, requestValidator(triviaValidation), async(req, res) => {
    try {
        const { status, ...data} = await triviaService.update(req.params.id,req.body);
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { status, ...data} = await triviaService.remove(req.params.id);
        res.status(status).send(data);
    } catch (error) {
        res.status(500).send({ msgText: 'Something went wrong!'})
    }
});

export default router;