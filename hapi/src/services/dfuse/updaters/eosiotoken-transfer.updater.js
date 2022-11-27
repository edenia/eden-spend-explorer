const { edenTransactionGql } = require('../../../gql')
const { updaterUtil } = require('../../../utils')
const { transactionConstant } = require('../../../constants')

module.exports = {
  type: `eosio.token:transfer`,
  apply: async action => {
    let { category, description } = updaterUtil.memoSplit(
      action.json.memo.split(':')[1] || ''
    )

    if (action.json.to === transactionConstant.RECIPIENTS.pomelo)
      category = 'pomelo'

    if (action.json.to === transactionConstant.RECIPIENTS.edenia)
      category = 'infrastructure'

    if (!updaterUtil.isEdenExpense(action.json.memo)) {
      description = action.json.memo
    }

    try {
      const amount = Number(action.json.quantity.split(' ')[0])
      const transactionData = {
        txid: action.transaction_id,
        amount,
        category,
        date: action.timestamp,
        description,
        id_election: action.election.id,
        recipient: action.json.to,
        type: 'expense',
        eos_exchange: action.eosPrice,
        usd_total: amount * action.eosPrice
      }
      const registeredTransaction = await edenTransactionGql.get({
        txid: { _eq: transactionData.txid }
      })

      if (!registeredTransaction) await edenTransactionGql.save(transactionData)
    } catch (error) {
      console.error(`transfer sync error ${action.action}: ${error.message}`)
    }
  }
}
