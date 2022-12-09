const moment = require('moment')

const { sleepUtil, communityUtil, updaterUtil } = require('../../../utils')
const { edenTransactionGql, edenElectionGql } = require('../../../gql')
const { transactionConstant } = require('../../../constants')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

module.exports = {
  type: `eosio.token:transfer`,
  apply: async action => {
    const registeredTransaction = await edenTransactionGql.get({
      txid: { _eq: action.transaction_id },
      amount: { _eq: action.json?.quantity?.split(' ')[0] || 0 },
      memo: { _eq: action.json.memo },
      id_election: { _eq: action.election.id },
      recipient: { _eq: action.json.to },
      type: { _eq: 'expense' }
    })

    if (registeredTransaction) return

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
      const { idElection } = await updaterUtil.getElectionWithoutExpense(
        action.json.from,
        amount,
        edenElectionGql,
        edenTransactionGql
      )
      const txDate = moment(action.timestamp).format('DD-MM-YYYY')

      if (LASTEST_RATE_DATE_CONSULTED !== txDate) {
        try {
          const data = await communityUtil.getExchangeRateByDate(txDate)
          LASTEST_RATE_DATA_CONSULTED = data.market_data.current_price.usd
          LASTEST_RATE_DATE_CONSULTED = txDate
        } catch (error) {
          console.error(
            `error transferUpdater, number of date queries exceded: ${error.message}`
          )

          await sleepUtil(60)

          return action.updater.apply(action)
        }
      }

      const transactionData = {
        txid: action.transaction_id,
        amount,
        category,
        date: action.timestamp,
        description,
        id_election:
          category === 'uncategorized' ? action.election.id : idElection,
        recipient: action.json.to,
        type: 'expense',
        eos_exchange: LASTEST_RATE_DATA_CONSULTED,
        usd_total: amount * LASTEST_RATE_DATA_CONSULTED,
        memo: action.json.memo
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
