const { delegateFrontend } = require('../services')

module.exports = {
  method: 'POST',
  path: '/get-delegates',
  handler: async ({
    payload: {
      input: {
        electionNumber: { election }
      }
    }
  }) => {
    try {
      const data = await delegateFrontend.getData(election)

      return data
    } catch (error) {
      return error.message
    }
  }
}
