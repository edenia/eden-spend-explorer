const { edenTransactionGql } = require('../../../gql')

module.exports = {
  type: `genesis.eden:fundtransfer`,
  apply: async action => {
    await edenTransactionGql.deleteTx({
      date: { _eq: action.timestamp },
      eden_election: {
        delegate_level: { _eq: action.data.rank },
        eden_delegate: { account: { _eq: action.data.from } }
      }
    })
  }
}
