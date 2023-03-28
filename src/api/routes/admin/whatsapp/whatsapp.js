import { Router } from "express";
import { whatsappService } from "../../../../services";
import { requestValidator } from "../../../middlewares";
import logger from "../../../../loaders/logger";
import Joi from 'joi';
import { formatFormError } from "../../../../utils/helper";

const router = new Router();

router.post('/sendTextMessage', (req, res) => {
    const data = whatsappService.prepareTextMessage({
        messageType: "text",
        recipientMobileNumber: '919892252713',
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

const templateValidation = Joi.object({
    event_id: Joi.string().required(),
    template_name: Joi.string().valid('bbe_decoration','bbe_good_night',
    'bbe_guest_pickup','bbe_get_ready','bbe_good_morning','bbe_food').required(),
    template_value1: Joi.when('template_name', {
        is: Joi.exist().valid('bbe_decoration','bbe_guest_pickup','bbe_get_ready','bbe_food'),
        then: Joi.string().min(3).required(),
        otherwise: Joi.forbidden()
    }),
    template_value2: Joi.when('template_name', {
        is: Joi.exist().valid('bbe_guest_pickup'),
        then: Joi.string().min(3).required(),
        otherwise: Joi.forbidden()
    }),
});

router.post('/sendTempTextMessage', requestValidator(templateValidation), async(req, res) => {
   
    const data = await whatsappService.prepareTempTextMessage(req.values);
    console.log('payload data: ', data);
    if(data && data.to){
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
    } else {
        res.status(404).send({ success: false, msgText: data, })
    }
});

export default router;