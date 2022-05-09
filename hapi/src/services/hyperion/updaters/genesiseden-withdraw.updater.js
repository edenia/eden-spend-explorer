const { edenDelegatesGql } = require('../../../gql')

module.exports = {
  type: `genesis.eden:withdraw`,
  apply: async action => {
    try {
      // SPLIT BY PER fundtransfer
      const {
        transaction_id: transactionId,
        timestamp,
        data: { amount, distribution_time: date, from, memo, rank, to }
      } = action

      const templateIncome = {
        txid: transactionId,
        date,
        type: 'income',
        delegate: from,
        election: 1,
        amount: 139.8602,
        recipient: to,
        category: null,
        description: memo
      }

      const member = await edenDelegatesGql.get({
        account: { _eq: to }
      })

      console.log('MEMBER', member)

      if (!member) {
        console.log('MEMBER DOES NOT EXIST')

        return
      }
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
