const { edenTransactionGql } = require('../../../gql')

module.exports = {
  type: `genesis:fundtransfer`,
  apply: async action => {
    try {
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
