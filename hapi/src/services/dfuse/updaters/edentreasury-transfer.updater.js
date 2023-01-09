const moment = require('moment')

const { edenTreasury } = require('../../../gql')
const { communityUtil, sleepUtil } = require('../../../utils')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

module.exports = {
  type: 'edentreasury:transfer',
  apply: async action => {
    try {
      const { id, amount, balance, blockNum, date, type, updater } = action

      const registerTransfer = await edenTreasury.get({
        txid: { _eq: id }
      })

      if (registerTransfer) return

      const txDate = moment(date).format('DD-MM-YYYY')

      if (LASTEST_RATE_DATE_CONSULTED !== txDate) {
        try {
          const data = await communityUtil.getExchangeRateByDate(txDate)
          LASTEST_RATE_DATA_CONSULTED = data.market_data.current_price.usd
          LASTEST_RATE_DATE_CONSULTED = txDate
        } catch (error) {
          console.error(
            `error treasuryUpdater, number of date queries exceded: ${error.message}`
          )

          await sleepUtil(60)

          return updater.apply(action)
        }
      }

      const treasuryData = {
        txid: id,
        balance: balance,
        type: type,
        amount: amount,
        date: date,
        eos_exchange: LASTEST_RATE_DATA_CONSULTED,
        usd_total: balance * LASTEST_RATE_DATA_CONSULTED,
        last_synced_at: blockNum
      }

      edenTreasury.save(treasuryData)
    } catch (error) {
      console.error(`treasury updater sync error: ${error.message}`)
    }
  }
}
