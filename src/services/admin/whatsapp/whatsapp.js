import fetch from "node-fetch";
import { eventService } from "../..";
import config from "../../../config";

export const prepareTextMessage = ({
  messageType = "text",
  recipientMobileNumber = null,
  recipientType = "individual",
  message = null
}) => {
  return {
    messaging_product: "whatsapp",
    recipient_type: recipientType,
    to: recipientMobileNumber,
    type: messageType,
    text: {
        body: message
    }
  }
}

export const prepareTempTextMessage = ({ values, guestContacts, clientContact }) => {
  const { template_name, template_value1, template_value2 } = values;
  let to;
  const defaultKeys = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "template"
  }
  
  if(template_name === 'bbe_good_morning' || template_name === 'bbe_good_evening' || template_name === 'bbe_good_night'){
    to = guestContacts;
    const simpleTemplateKeys = {
      ...defaultKeys,
      to,
      template: {
        name: template_name,
        language: {
          code: "en"
        }
      }
    }
    return simpleTemplateKeys;
  } else if(template_name === 'bbe_guest_pickup') {
    to = clientContact;
    const multipleParamKeys = {
      ...defaultKeys,
      to,
      template: {
        name: template_name,
        language: {
          code: "en"
        },
        components: [{
          type: "body",
          parameters: [
            {
              type: "text",
              text: template_value1
            },
            {
              type: "text",
              text: template_value2
            }
          ]
        }]
      } 
    }
    return multipleParamKeys;
  } else {   // decoration, get_ready and food
    if(template_name === 'bbe_decoration') {
      to = clientContact;
    } else {
      to = guestContacts;
    }
    const singleParamKeys = {
      ...defaultKeys,
      to,
      template: {
        name: template_name,
        language: {
          code: "en"
        },
        components: [{
          type: "body",
          parameters: [
            {
              type: "text",
              text: template_value1
            }
          ]
        }]
      } 
    }
    return singleParamKeys;
  }
}

export const sendMessage = async(body) => {
    const response = await fetch(`https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Authorization': `Bearer ${config.WAB_KEY}`, 
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
};
