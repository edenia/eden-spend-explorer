const moment = require('moment')

const {
  edenDelegatesGql,
  edenHistoricElectionGql,
  edenElectionGql,
  edenTransactionGql
} = require('../gql')
const { servicesConstant } = require('../constants')
const { servicesUtil } = require('../utils')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

const registerUnclaimedTransaction = async (
  date,
  account,
  rank,
  amount,
  id
) => {
  const registeredTransaction = await edenTransactionGql.get({
    txid: { _eq: id }
  })

  if (registeredTransaction) return

  const txDate = moment(date).format('DD-MM-YYYY')

  if (LASTEST_RATE_DATE_CONSULTED !== txDate) {
    const data = await servicesUtil.getExchangeRateByDate(txDate)
    LASTEST_RATE_DATA_CONSULTED = data.market_data.current_price.usd
    LASTEST_RATE_DATE_CONSULTED = txDate
  }

  const election = await edenHistoricElectionGql.get({
    date_election: { _lte: date }
  })
  const delegateData = await edenDelegatesGql.get({
    account: { _eq: account }
  })
  const electionData = await edenElectionGql.get({
    id_delegate: { _eq: delegateData.id },
    election: { _eq: election.election }
  })

  const transactionData = {
    txid: id,
    amount,
    category: 'unclaimed',
    date: date,
    description: `distribution funds rank ${rank}`,
    id_election: electionData.id,
    recipient: account,
    type: 'income',
    eos_exchange: LASTEST_RATE_DATA_CONSULTED,
    usd_total: amount * LASTEST_RATE_DATA_CONSULTED
  }

  await edenTransactionGql.save(transactionData)
}

const updateUnclaimedFunds = async () => {
  let nextKey = null
  while (true) {
    const delegates = await servicesUtil.loadTableData(
      { next_key: nextKey, limit: 10000 },
      'distaccount'
    )

    for (const delegate of delegates.rows) {
      const date = delegate[1].distribution_time
      const account = delegate[1].owner
      const rank = delegate[1].rank
      const id = delegate[1].id.toString()
      const amount = Number(delegate[1].balance.split(' ')[0])
      await registerUnclaimedTransaction(date, account, rank, amount, id)
    }

    if (!delegates.more) break

    nextKey = delegates.next_key
  }
}

const updateEdenUncleimedFundsWorker = () => {
  return {
    name: servicesConstant.MESSAGES.uncleimedFunds,
    interval: servicesUtil.nextDistributionDate,
    action: updateUnclaimedFunds
  }
}

module.exports = {
  updateEdenUncleimedFundsWorker
}
