const { edenTransactionGql }    = require('../../../gql')

module.exports = {
  type: `genesis.eden:withdraw`,
  apply: async action => {    
    try {
      const transactionData = {
        txid        : action.transaction_id,
        amount      : action.data.amount,
        category    : 'income from genesis.edens',
        date        : action.timestamp,
        description : action.data.memo,
        id_election : action.idElection,
        recipient   : action.data.to,
        type        : 'income',
        eos_exchange: action.eosPrice,
        usd_total   : action.data.amount * action.eosPrice
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
