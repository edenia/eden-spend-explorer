const moment = require('moment')

const {
  edenDelegatesGql,
  edenHistoricElectionGql,
  edenElectionGql,
  edenTransactionGql
} = require('../gql')
const { servicesConstant } = require('../constants')
const { sleepUtil, eosUtil, axiosUtil } = require('../utils')
const { hyperionConfig, edenConfig, eosConfig } = require('../config')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

const historicDelegates = async ({
  next_key: nextKey = null,
  limit = 100
} = {}) => {
  return await eosUtil.getTableRows({
    code: edenConfig.edenContract,
    scope: 0,
    table: 'distaccount',
    limit,
    lower_bound: nextKey
  })
}

const getActions = async (params, filter) => {
  const limit = 100
  const { data } = await axiosUtil.get(
    `${hyperionConfig.api}/v2/history/get_actions`,
    {
      params: {
        ...params,
        limit,
        filter: filter,
        sort: 'asc',
        simple: true,
        checkLib: true
      }
    }
  )
  const notIrreversible = data.simple_actions.find(item => !item.irreversible)

  if (notIrreversible) {
    await sleepUtil(1)

    return getActions(params)
  }

  return {
    hasMore: data.total.value > limit + params.skip || 0,
    actions: data.simple_actions
  }
}

const registerHistoricDelegate = async (date, account, rank) => {
  const election = await edenHistoricElectionGql.get({
    date_election: { _lte: date }
  })

  let registeredMember = await edenDelegatesGql.get({
    account: { _eq: account }
  })

  if (!registeredMember)
    registeredMember = await edenDelegatesGql.save({ account })

  const electionData = {
    id_delegate: registeredMember.id,
    election: election.election,
    delegate_level: rank
  }

  let registeredElection = await edenElectionGql.get({
    id_delegate: { _eq: registeredMember.id },
    election: { _eq: electionData.election }
  })

  if (!registeredElection)
    registeredElection = await edenElectionGql.save(electionData)

  if (registeredElection.delegate_level < electionData.delegate_level) {
    const newRank = electionData.delegate_level
    await edenElectionGql.update({
      where: {
        id_delegate: { _eq: electionData.id_delegate },
        election: { _eq: electionData.election }
      },
      _set: {
        delegate_level: newRank
      }
    })
  }
}

const registerUnclaimedTransaction = async (
  date,
  account,
  rank,
  amount,
  id
) => {
  const txDate = await moment(date).format('DD-MM-YYYY')

  if (LASTEST_RATE_DATE_CONSULTED !== txDate) {
    const { data } = await axiosUtil.get(
      `${eosConfig.eosHistory}/coins/eos/history`,
      {
        params: {
          date: txDate,
          localization: false
        }
      }
    )
    LASTEST_RATE_DATA_CONSULTED = data.market_data.current_price.usd
    LASTEST_RATE_DATE_CONSULTED = txDate
  }

  try {
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
    const registeredTransaction = await edenTransactionGql.get({
      txid: { _eq: transactionData.txid }
    })

    if (!registeredTransaction) await edenTransactionGql.save(transactionData)
  } catch (error) {
    console.error(`error to sync ${error.message}`)
  }
}

const runDelegateUpdaters = async actions => {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index]
    try {
      const date = action.data.distribution_time
      const account = action.data.to
      const rank = action.data.rank
      await registerHistoricDelegate(date, account, rank)
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}

const getDelegateByFundTransfer = async () => {
  let skip = 0
  let hasMore = true
  let actions = []
  try {
    while (hasMore) {
      ;({ hasMore, actions } = await getActions(
        { skip },
        `${edenConfig.edenContract}:fundtransfer`
      ))
      skip += actions.length
      await runDelegateUpdaters(actions)
    }
  } catch (error) {
    console.error('hyperion error', error.message)
  }
}

const updateHistoricDelegate = async () => {
  let nextKey = null
  while (true) {
    const delegates = await historicDelegates({ next_key: nextKey })
    for (const delegate of delegates.rows) {
      const date = delegate[1].distribution_time
      const account = delegate[1].owner
      const rank = delegate[1].rank
      const id = delegate[1].id.toString()
      const amount = Number(delegate[1].balance.split(' ')[0])
      await registerHistoricDelegate(date, account, rank)
      await registerUnclaimedTransaction(date, account, rank, amount, id)
    }

    if (!delegates.more) break

    nextKey = delegates.next_key
  }
  await getDelegateByFundTransfer()
}

const updateDelegateTable = () => {
  return {
    name: servicesConstant.MESSAGES.historicDelegates,
    interval: edenConfig.edenElectionInterval,
    action: updateHistoricDelegate
  }
}

module.exports = {
  updateDelegateTable
}
