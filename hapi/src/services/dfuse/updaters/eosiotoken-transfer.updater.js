const moment = require('moment')

const { sleepUtil, communityUtil, updaterUtil } = require('../../../utils')
const {
  edenTransactionGql,
  edenElectionGql,
  edenTotalExpenseByDelegateAndElection,
  edenGlobalAmountGql
} = require('../../../gql')
const { transactionConstant } = require('../../../constants')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

module.exports = {
  type: `eosio.token:transfer`,
  apply: async action => {
    const { quantity, memo, to, from } = action.action.json
    const amount = Number(quantity.split(' ')[0] || 0)

    const registeredTransaction = await edenTransactionGql.get({
      txid: { _eq: action.transaction_id },
      digest: { _eq: action.action.receipt.digest }
    })

    if (registeredTransaction) return

    const registeredTxWithoutDigest = await edenTransactionGql.get({
      txid: { _eq: action.transaction_id },
      digest: { _eq: action.transaction_id }
    })

    if (registeredTxWithoutDigest) {
      await edenTransactionGql.update({
        where: {
          id: { _eq: registeredTxWithoutDigest.id }
        },
        _set: { digest: action.action.receipt.digest }
      })
      return
    }

    let { category, description } = updaterUtil.memoSplit(
      memo.split(':')[1] || ''
    )

    if (to === transactionConstant.RECIPIENTS.edenia)
      category = 'infrastructure'

    if (!updaterUtil.isEdenExpense(memo)) {
      description = memo
    }

    try {
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
        id_election: action.election.id,
        recipient: to,
        type: 'expense',
        eos_exchange: LASTEST_RATE_DATA_CONSULTED,
        usd_total: amount * LASTEST_RATE_DATA_CONSULTED,
        digest: action.action.receipt.digest
      }

      await edenTransactionGql.save(transactionData)

      if (category === 'uncategorized') return

      await updaterUtil.saveTotalByDelegateAndElection(
        action.transaction_id,
        from,
        amount,
        LASTEST_RATE_DATA_CONSULTED,
        category,
        edenElectionGql,
        edenTransactionGql,
        edenTotalExpenseByDelegateAndElection,
        edenGlobalAmountGql
      )
    } catch (error) {
      console.error(
        `transfer sync error ${action.action.name}: ${error.message}`
      )
    }
  }
}
