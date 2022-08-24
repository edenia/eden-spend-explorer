const { edenTransactionGql } = require('../../../gql')
const { updaterUtil } = require('../../../utils')
const { transactionConstant } = require('../../../constants')

module.exports = {
  type: `eosio.token:transfer`,
  apply: async action => {
    let { category, description } = updaterUtil.memoSplit(
      action.data.memo.split(':')[1] || ''
    )

    if (action.data.to === transactionConstant.RECIPIENTS.pomelo)
      category = 'pomelo'

    if (action.data.to === transactionConstant.RECIPIENTS.edenia)
      category = 'infrastructure'

    try {
      const transactionData = {
        txid: action.transaction_id,
        amount: action.data.amount,
        category,
        date: action.timestamp,
        description,
        id_election: action.electionId,
        recipient: action.data.to,
        type: 'expense',
        eos_exchange: action.eosPrice,
        usd_total: action.data.amount * action.eosPrice
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
