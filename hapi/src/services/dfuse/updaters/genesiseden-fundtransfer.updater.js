const moment = require('moment')

const { communityUtil, sleepUtil } = require('../../../utils')
const { edenTransactionGql } = require('../../../gql')
const { edenConfig } = require('../../../config')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

module.exports = {
  type: `${edenConfig.edenContract}:fundtransfer`,
  apply: async action => {
    try {
      const amount = Number(action.json.amount.split(' ')[0])
      const existTx = await edenTransactionGql.get({
        date: { _eq: action.json.distribution_time },
        amount: { _eq: amount },
        eden_election: {
          eden_delegate: { account: { _eq: action.json.from } }
        }
      })

      if (!existTx) {
        const txDate = moment(action.timestamp).format('DD-MM-YYYY')

        if (LASTEST_RATE_DATE_CONSULTED !== txDate) {
          try {
            const data = await communityUtil.getExchangeRateByDate(txDate)
            LASTEST_RATE_DATA_CONSULTED = data.market_data.current_price.usd
            LASTEST_RATE_DATE_CONSULTED = txDate
          } catch (error) {
            console.error(
              `error fundstransferUpdater, number of date queries exceeded: ${error.message}`
            )

            await sleepUtil(60)

            return action.updater.apply(action)
          }
        }

        const transactionData = {
          txid: action.transaction_id,
          amount,
          category: 'claimed',
          date: action.json.distribution_time,
          description: action.json.memo,
          id_election: action.election.id,
          recipient: action.json.from,
          type: 'income',
          eos_exchange: LASTEST_RATE_DATA_CONSULTED,
          usd_total: amount * LASTEST_RATE_DATA_CONSULTED
        }

        await edenTransactionGql.save(transactionData)
      } else {
        await edenTransactionGql.update({
          where: {
            id: { _eq: existTx.id }
          },
          _set: { txid: action.transaction_id, category: 'claimed' }
        })
      }
    } catch (error) {
      console.error(
        `fundtransfer sync error ${action.action}: ${error.message}`
      )
    }
  }
}
