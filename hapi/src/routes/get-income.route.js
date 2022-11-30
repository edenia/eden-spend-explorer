const { incomeFrontend } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-income',
  handler: async () => {
    try {
      const data = await incomeFrontend.getData()

      return data
    } catch (error) {
      return error.message
    }
  }
}
