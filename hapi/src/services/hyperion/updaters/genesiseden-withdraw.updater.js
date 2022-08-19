const { edenTransactionGql } = require('../../../gql')

module.exports = {
  type: `genesis.eden:withdraw`,
  apply: async action => {
    const amount = Number(action.data.quantity.split(' ')[0])

    try {
      const transactionData = {
        txid: action.transaction_id,
        amount,
        category: 'income from genesis.eden',
        date: action.timestamp,
        description: action.actors,
        id_election: action.electionId,
        recipient: action.data.owner,
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
