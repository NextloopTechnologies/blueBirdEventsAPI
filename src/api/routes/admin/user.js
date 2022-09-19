import { Router } from 'express';
import { userService } from '../../../services';
import { formatFormError } from '../../../utils/helper';
import Joi from 'joi';
const router = new Router();
import { auth, fileUploads, requestValidator } from '../../middlewares';

router.get('/test', (req,res) => {
    try {
        res.send({message: 'Hello'});
    } catch (error) {
        res.status(500).send(error);
    }
});

const userRegisterValidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required().trim(),
    email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).required().trim(),
    password: Joi.string().min(6).max(16).required().trim(),
    mobile: Joi.string().regex(/^[0-9]{10}$/)
    .messages({'string.pattern.base': `Phone number must have 10 digits.`}),
    role: Joi.number().valid(1,2,3).required()
});

router.post('/create', requestValidator(userRegisterValidation),async (req, res) => {
    try {
        const { status, ...data} = await userService.createUser(req.values);
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

const userLoginValidation = Joi.object({
    email: Joi.string().email({ minDomainSegments:2, tlds: {allow: ['com','in']}}).required().trim(),
    password: Joi.string().min(6).max(16).required().trim()
});

router.post('/login', requestValidator(userLoginValidation),async (req, res) => {
    try {
        const { status, ...data} = await userService.loginUser(req.values);
        res.status(status).send(data);
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

router.get('/account', auth,(req, res) => {
    res.status(200).send({ success: true, user: req.user});
});

router.post('/account/profile', auth, fileUploads('profile',1),(req, res) => {    
    try {
        console.log("From multer ",req.file);
        //s3 bucket goes here
        res.send('success');
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error: "Something went wrong"});
    }
           
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send({msgText: 'Successfully Logged Out!'});
    } catch (error) {
        console.log(error);
        const { status, ...data } = formatFormError(error);
        res.status(status).send(data);
    }
});

export default router;