const axios = require('axios')
const endPoint = 'https://openapi.zalo.me/v2.0/oa'

const sendTextMessage = async (token, reciever, message) => {
  const res = await axios.post(`${endPoint}/message?access_token=${token}`, {
    recipient: { user_id: reciever },
    message: { text: message }
  })
  return res.data
}

const sendListMessage = async (token, user_id, elements = [], buttons = []) => {
  const attachment = {
    type: 'template',
    payload: { template_type: 'list' }
  }
  if (elements.length) attachment.payload.elements = elements
  if (buttons.length) attachment.payload.buttons = buttons

  const res = await axios.post(`${endPoint}/message?access_token=${token}`, {
    recipient: { user_id },
    message: { attachment }
  })

  return res.data
}

module.exports = { sendTextMessage, sendListMessage }
