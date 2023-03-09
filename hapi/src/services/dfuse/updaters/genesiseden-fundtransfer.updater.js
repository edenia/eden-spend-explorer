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
      const {
        amount: quantity,
        from,
        distribution_time,
        rank
      } = action.action.json
      const amount = Number(quantity.split(' ')[0])

      const existTx = await edenTransactionGql.get({
        date: { _eq: distribution_time },
        amount: { _eq: amount },
        eden_election: {
          eden_delegate: { account: { _eq: from } }
        },
        description: { _eq: `distribution funds rank ${rank}` }
      })

      const txDate = moment(action.timestamp).format('DD-MM-YYYY')

      if (!existTx) {
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
          date: distribution_time,
          description: `distribution funds rank ${rank}`,
          id_election: action.election.id,
          recipient: from,
          type: 'income',
          eos_exchange: LASTEST_RATE_DATA_CONSULTED,
          usd_total: amount * LASTEST_RATE_DATA_CONSULTED
        }

        await edenTransactionGql.save(transactionData)

        const existUnclaimedTx = await edenTransactionGql.get({
          date: { _eq: distribution_time },
          eden_election: {
            eden_delegate: { account: { _eq: from } }
          },
          description: { _eq: `distribution funds rank ${rank}` },
          category: { _eq: 'unclaimed' }
        })

        if (!existUnclaimedTx) return

        const newAmount = existUnclaimedTx.amount - amount

        if (newAmount <= 0) {
          await edenTransactionGql.deleteTx({
            where: {
              id: { _eq: existUnclaimedTx.id }
            }
          })
        } else {
          await edenTransactionGql.update({
            where: {
              id: { _eq: existUnclaimedTx.id }
            },
            _set: { amount: newAmount }
          })
        }
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
        `fundtransfer sync error ${action.action.action.name}: ${error.message}`
      )
    }
  }
}
