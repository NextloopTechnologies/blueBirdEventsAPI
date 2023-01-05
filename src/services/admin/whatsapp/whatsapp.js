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

export const prepareTempTextMessage = ({recipientMobileNumber, message }) => {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipientMobileNumber,
    type: "template",
    template: {
      name: "bbe-reminder-template",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: message
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
      'Authorization': "Bearer EAALxx2nv6PYBAOX6vxxTmBRwFZBLnxJyLuUUuJ7877BPKAl4ArqKP8vuaJqbRjfWP1A6ZBnM0MdJDvYILxISuN2FoWJnUG1KC3GiLEtzfw5fVz7cGwDeMM2ZCSO4enL28f9RZBES8u9hp0mfXjGQ86mPrbapagtBJhVvRZBa9NmaYpfxwuIGMd6hXFF8XRtKZBo2Ie84kGbIlKNgvvzZCK9", 
      'Content-Type': 'application/json'
    }
  });
  console.log("response:", response);
  return await response.json();
}
