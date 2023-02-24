import fetch from "node-fetch";

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

export const prepareTempTextMessage = ({ recipientMobileNumber }) => {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipientMobileNumber,
    type: "template",
    template: {
      name: "bluebirdevents_food",
      language: {
        code: "en_US"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: "Dinner"
            }
          ] 
        }
      ]
    }
  }
}

export const sendMessage = async(body) => {
  const response = await fetch(`https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Authorization': "Bearer EAALxx2nv6PYBAELzW8wXXMFBJvv1ohpCuDTv5G92bk6Ke6DZBlVyeBf22JFs9hzYjE1nei8jkVTw0V1ykF7nGPYcYb1CH8r8glbewTOfgSn3OtWxJEpxcXGPZBUyuZAQbXmeCawT6EUcQoNJlQOtEZCfT6PWQqws3G3QQMmyKzROOFFCzEhzpbyYto5QZBiZCKf41Mmydlei1HfgN53qBI", 
      'Content-Type': 'application/json'
    }
  });
  console.log("response:", response);
  return await response.json();
}
