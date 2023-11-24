import { Router } from "express";
import { whatsappService } from "../../../../services";
import { requestValidator } from "../../../middlewares";
import Joi from 'joi';
import { eventService } from "../../../../services";

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
   
    const { status, success, msgText, recipientMobileNumbers } =  await eventService.getWhatsappRecipients(req.values.event_id);
    if(!success) {
        return res.status(status).send({ success, msgText });
    }
    const guestContacts = recipientMobileNumbers.guest_mobiles;
    const clientContact = recipientMobileNumbers.client_mobile;

    if(req.values.template_name === "bbe_decoration" || req.values.template_name === "bbe_guest_pickup"){
        const data = whatsappService.prepareTempTextMessage({ values: req.values, clientContact } );
        whatsappService.sendMessage(data)
    } else {
        await Promise.all(guestContacts.map(guest => {
            const data = whatsappService.prepareTempTextMessage({ values: req.values, guestContacts: guest });
            whatsappService.sendMessage(data)
        }));
    }
    
    res.status(200).send({ success: true, msgText: "Sent Successfully", })
});

export default router;