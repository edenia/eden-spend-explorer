const moment = require('moment')

const { sleepUtil, communityUtil, updaterUtil } = require('../../../utils')
const { edenTransactionGql, edenElectionGql } = require('../../../gql')
const { transactionConstant } = require('../../../constants')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

module.exports = {
  type: `eosio.token:transfer`,
  apply: async action => {
    const { quantity, memo, to, from } = action.json
    const amount = Number(quantity.split(' ')[0] || 0)

    const registeredTransaction = await edenTransactionGql.get({
      txid: { _eq: action.transaction_id },
      amount: { _eq: amount },
      memo: { _eq: memo },
      recipient: { _eq: to },
      type: { _eq: 'expense' }
    })

    if (registeredTransaction) return

    let { category, description } = updaterUtil.memoSplit(
      memo.split(':')[1] || ''
    )

    if (to === transactionConstant.RECIPIENTS.edenia)
      category = 'infrastructure'

    if (!updaterUtil.isEdenExpense(memo)) {
      description = memo
    }

    try {
      const { idElection } = await updaterUtil.getElectionWithoutExpense(
        from,
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
        recipient: to,
        type: 'expense',
        eos_exchange: LASTEST_RATE_DATA_CONSULTED,
        usd_total: amount * LASTEST_RATE_DATA_CONSULTED,
        memo: memo
      }

      await edenTransactionGql.save(transactionData)
    } catch (error) {
      console.error(`transfer sync error ${action.action}: ${error.message}`)
    }
  }
}
