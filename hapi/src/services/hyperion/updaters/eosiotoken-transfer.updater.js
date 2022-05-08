const { edenAccountGql } = require('../../../gql')

module.exports = {
  type: `eosio.token:transfer`,
  apply: async action => {
    try {
      // await edenAccountGql.save({})
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
