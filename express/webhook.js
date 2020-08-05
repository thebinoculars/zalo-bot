const axios = require('axios')
const zalo = require('./zalo')

const quoteAction = async (token, body) => {
  const { data } = await axios.get(
    'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
  )

  return zalo.sendTextMessage(token, body.user_id_by_app, data.quoteText)
}

const methods = {
  quote: 'Quote ngẫu nhiên'
}

const defaultAction = (token, body) => {
  const elements = [
    {
      title: 'Hero',
      subtitle: 'Tính năng',
      image_url: 'https://via.placeholder.com/300x300.png?text=Hero',
      default_action: {
        type: 'oa.open.url',
        url: 'https://www.hero.tk/'
      }
    }
  ]

  Object.entries(methods).forEach(([key, title]) => {
    elements.push({
      title,
      image_url: `https://via.placeholder.com/300x300.png?text=${key}`,
      default_action: {
        type: 'oa.query.show',
        payload: `#${key}`
      }
    })
  })

  return zalo.sendListMessage(token, body.user_id_by_app, elements)
}

module.exports = {
  quoteAction,
  defaultAction
}
