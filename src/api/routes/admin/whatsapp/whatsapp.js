import { Router } from "express";
import { whatsappService } from "../../../../services";
import logger from "../../../../loaders/logger";
import Joi from 'joi';

const router = new Router();

router.post('/sendTextMessage', (req, res) => {
    const data = whatsappService.prepareTextMessage({
        messageType: "text",
        recipientMobileNumber: '916389911001',
        recipientType: "individual",
        message: 'Welcome to Blue Bird Event, Whatapps service node.js working'
    })
    console.log('payload data: ', data);
    whatsappService.sendMessage(data).then(val => {
        console.log('data:', val);
        res.status(200).json(val);
    })
    .catch(error => {
        console.log('error:', error);
        res.status(500).json({
            error
        });
    })
});

router.post('/sendTempTextMessage', (req, res) => {
    const data = whatsappService.prepareTempTextMessage({
        recipientMobileNumber: '916389911001',
        message: 'Welcome to Blue Bird Event, This is a template text message!'
    })
    console.log('payload data: ', data);
    whatsappService.sendMessage(data).then(val => {
        console.log('data:', val);
        res.status(200).json(val);
    })
    .catch(error => {
        console.log('error:', error);
        res.status(500).json({
            error
        });
    })
});



// const triviaValidation = Joi.object({
//     title: Joi.string().min(6).max(60).trim().required(),
//     descp: Joi.string().min(10).required(),
//     id: Joi.string()
// });

// router.post('/create', auth, checkPermission('create-trivia'),  requestValidator(triviaValidation), async(req, res) => {
//     try {
//         const { status, ...data} = await triviaService.create(req.values);
//         res.status(status).send(data);
//     } catch (error) {
//         logger('ADMIN_TRIVIA-CREATE-CONTROLLER').error(error);
//         const { status, ...data } = formatFormError(error);
//         res.status(status).send(data);
//     }
// });

// router.get('/read/:id', auth, checkPermission('read-trivia'),  async (req, res)=> {
//     try {
//         const _id = req.params.id;
//         const { status, ...data} = await triviaService.read({_id});
//         res.status(status).send(data);
//     } catch (error) {
//         logger('ADMIN_TRIVIA-READ-CONTROLLER').error(error);
//         const { status, ...data } = formatFormError(error);
//         res.status(status).send(data);
//     }
// });

// router.post('/update/:id', auth, checkPermission('update-trivia'),  requestValidator(triviaValidation), async(req, res) => {
//     try {
//         const { status, ...data} = await triviaService.update(req.params.id,req.values);
//         res.status(status).send(data);
//     } catch (error) {
//         logger('ADMIN_TRIVIA-UPDATE-CONTROLLER').error(error);
//         const { status, ...data } = formatFormError(error);
//         res.status(status).send(data);
//     }
// });

// router.post('/delete', auth, checkPermission('delete-trivia'),  async (req, res) => {
//     try {
//         const { status, ...data} = await triviaService.remove(req.body.ids);
//         res.status(status).send(data);
//     } catch (error) {
//         res.status(500).send({ msgText: 'Something went wrong!'})
//     }
// });

export default router;