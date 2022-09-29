const { edenConfig } = require('../config')

const CATEGORIES = [
  'admin',
  'charity',
  'development',
  'dues',
  'education',
  'hardware',
  'infrastructure',
  'legal',
  'marketing',
  'pomelo',
  'salaries',
  'software',
  'travel'
]
const RECIPIENTS = {
  pomelo: 'app.pomelo',
  edenia: 'edenia4edens'
}
const RECEIVER = ['eosio.token', edenConfig.edenContract]

module.exports = {
  CATEGORIES,
  RECIPIENTS,
  RECEIVER
}
