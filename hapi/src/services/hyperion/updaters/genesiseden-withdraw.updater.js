const { edenTransactionGql } = require('../../../gql')
const { memoSplit }          = require('../../../utils')

module.exports = {
  type: `genesis.eden:withdraw`,
  apply: async action => {
    const { category, description } = memoSplit( action.data.memo.split(':')[1] || '' )
    try {
      const transactionData = {
        txid: action.transaction_id,
        amount: action.data.amount,
        category,
        date: action.timestamp,
        description,
        id_election: action.idElection,
        recipient: action.data.to,
        type: 'income'
      }
      const registeredTransaction = await edenTransactionGql.get({
        txid: { _eq: transactionData.txid }
      });      
      if (!registeredTransaction) await edenTransactionGql.save(transactionData)
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
