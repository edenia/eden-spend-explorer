const { edenTransactionGql } = require('../../../gql')
const { edenConfig } = require('../../../config')

module.exports = {
  type: `${edenConfig.edenContract}:fundtransfer`,
  apply: async action => {
    await edenTransactionGql.deleteTx({
      date: { _eq: action.json.distribution_time },
      eden_election: {
        delegate_level: { _eq: action.json.rank },
        eden_delegate: { account: { _eq: action.json.from } }
      }
    })
  }
}
