const axios = require('axios')
const endPoint = 'https://openapi.zalo.me/v2.0/oa'

const sendTextMessage = (token, reciever, message) => {
  return axios.post(`${endPoint}/message?access_token=${token}`, {
    recipient: { user_id: reciever },
    message: { text: message }
  })
}

const sendListMessage = (token, user_id, elements = [], buttons = []) => {
  const attachment = {
    type: 'template',
    payload: { template_type: 'list' }
  }
  if (elements.length) attachment.payload.elements = elements
  if (buttons.length) attachment.payload.buttons = buttons

  return axios.post(`${endPoint}/message?access_token=${token}`, {
    recipient: { user_id },
    message: { attachment }
  })
}

module.exports = { sendTextMessage, sendListMessage }
