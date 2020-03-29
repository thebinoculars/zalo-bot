const axios = require('axios')
const zalo = require('./zalo')

const coronaAction = async (token, body) => {
  const reciever = body.user_id_by_app
  const res = await axios.get('https://corona.lmao.ninja/countries/Vietnam')
  const apiData = res.data
  const message = `Tổng số ca mắc: ${apiData.cases}\n\nSố ca mắc trong ngày: ${apiData.todayCases}\n\nSố người chết: ${apiData.deaths}\n\nSố người chết trong ngày: ${apiData.todayDeaths}\n\nSố người đã bình phục: ${apiData.recovered}\n\nSố người đang điều trị: ${apiData.active}\n\nSố người trong tình trạng nguy kịch: ${apiData.critical}\n\nTỉ lệ mắc bệnh: ${apiData.casesPerOneMillion}/1000000`

  const data = await zalo.sendTextMessage(token, reciever, message)
  return data
}

const methods = {
  corona: 'Thông tin dịch Corona'
}

const defaultAction = async (token, body) => {
  const reciever = body.user_id_by_app
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

  const data = await zalo.sendListMessage(token, reciever, elements)
  return data
}

module.exports = {
  coronaAction,
  defaultAction
}
