const { edenTransactionGql } = require('../../../gql')
const { edenConfig } = require('../../../config')

module.exports = {
  type: `${edenConfig.edenContract}:withdraw`,
  apply: async action => {
    try {
      const amount = Number(action.json.quantity.split(' ')[0])
      const transactionData = {
        txid: action.transaction_id,
        amount,
        category: 'claimed',
        date: action.timestamp,
        description: action.json.owner,
        id_election: action.electionId,
        recipient: action.json.owner,
        type: 'income',
        eos_exchange: action.eosPrice,
        usd_total: amount * action.eosPrice
      }
      const registeredTransaction = await edenTransactionGql.get({
        txid: { _eq: transactionData.txid }
      })

      if (!registeredTransaction) await edenTransactionGql.save(transactionData)
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
