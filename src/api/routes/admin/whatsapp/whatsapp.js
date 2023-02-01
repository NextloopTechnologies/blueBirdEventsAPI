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

export default router;