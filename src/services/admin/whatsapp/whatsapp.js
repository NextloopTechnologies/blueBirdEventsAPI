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

export const prepareTempTextMessage = async(values) => {
  const { template_name } = values;
  const defaultKeys = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "template"
  }

  // let clientNumber = await Event.find(values.event_id)
  if(template_name === 'bbe_good_morning' || template_name === 'bbe_good_night'){
    const simpleTemplateKeys = {
      ...defaultKeys,
      to: '919892252713',
      template: {
        name: template_name,
        language: {
          code: "en_US"
        }
      }
    }
    return simpleTemplateKeys;
  } else if(template_name === 'bbe_guest_pickup') {
    const multipleParamKeys = {
      ...defaultKeys,
      template: {
        name: template_name,
        language: {
          code: "en_US"
        },
        components: [{
          type: "body",
          parameters: [
            {
              type: "text",
              text: "Josh"
            },
            {
              type: "text",
              text: "Airport"
            }
          ]
        }]
      } 
    }
    return multipleParamKeys;
  } else {
    const singleParamKeys = {
      ...defaultKeys,
      template: {
        name: template_name,
        language: {
          code: "en_US"
        },
        components: [{
          type: "body",
          parameters: [
            {
              type: "text",
              text: "Haldi"
            }
          ]
        }]
      } 
    }
    return singleParamKeys;
  }
}

export const sendMessage = async(values) => {
  try {
    console.log("before request", values);
    const body = prepareTempTextMessage(values);
    console.log("after body", body);
    const response = await fetch(`https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Authorization': `Bearer ${config.WAB_KEY}`, 
        'Content-Type': 'application/json'
      }
    });
    // response.json().then(val => {
    //     console.log('data:', val);
    //     return res.status(200).json(val);
    // })
    // .catch(error => {
    //     console.log('error:', error);
    //     return res.status(500).json({
    //         error
    //     });
    // })
    // console.log("response:", response);
    // return await response.json();
    const data = await response.json();
    return { status: 200, msgText: 'Sent Successfully!', success: true, data}
  } catch (error) {
    throw error;
  }
};
