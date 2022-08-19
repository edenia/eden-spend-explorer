const moment = require('moment')

const updaters = require('./updaters')
const hyperionStateService = require('../../gql/hyperion-state.gql')
const { edenElectionGql } = require('../../gql')
const { hyperionConfig, eosConfig } = require('../../config')
const { hasuraUtil, axiosUtil, sleepUtil } = require('../../utils')

const TIME_BEFORE_IRREVERSIBILITY = 164
let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

const getLastSyncedAt = async () => {
  const state = await hyperionStateService.getState()

  if (state) {
    return state.lastSyncedAt
  }

  await hyperionStateService.saveOrUpdate(hyperionConfig.startAt)

  return hyperionConfig.startAt
}

const getGap = lastSyncedAt => {
  if (moment().diff(moment(lastSyncedAt), 'minutes') > 0) {
    return {
      amount: 1,
      unit: 'minute'
    }
  }

  if (
    moment().diff(moment(lastSyncedAt), 'seconds') >=
    TIME_BEFORE_IRREVERSIBILITY * 2
  ) {
    return {
      amount: TIME_BEFORE_IRREVERSIBILITY,
      unit: 'seconds'
    }
  }

  if (
    moment().diff(moment(lastSyncedAt), 'seconds') >=
    TIME_BEFORE_IRREVERSIBILITY + 10
  ) {
    return {
      amount: 10,
      unit: 'seconds'
    }
  }

  return {
    amount: 1,
    unit: 'seconds'
  }
}

const getActions = async params => {
  const limit = 100
  const { data } = await axiosUtil.get(
    `${hyperionConfig.api}/v2/history/get_actions`,
    {
      params: {
        ...params,
        limit,
        filter: updaters.map(updater => updater.type).join(','),
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

const runUpdaters = async actions => {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index]
    const updater = updaters.find(
      item => item.type === `${action.contract}:${action.action}`
    )

    if (!updater) continue

    const edenElectionId =
      action.contract === 'genesis.eden'
        ? await edenElectionGql.get({
            eden_delegate: { account: { _eq: action.data.owner } }
          })
        : await edenElectionGql.get({
            eden_delegate: { account: { _eq: action.data.from } }
          })

    if (!edenElectionId) continue

    const txDate = await moment(action.timestamp).format('DD-MM-YYYY')

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

    await updater.apply({
      ...action,
      electionId: edenElectionId.id,
      eosPrice: LASTEST_RATE_DATA_CONSULTED
    })
  }
}

const sync = async () => {
  await hasuraUtil.hasuraAssembled()
  const lastSyncedAt = await getLastSyncedAt()
  const gap = getGap(lastSyncedAt)
  const after = moment(lastSyncedAt).toISOString()
  const before = moment(after).add(gap.amount, gap.unit).toISOString()
  const diff = moment().diff(moment(before), 'seconds')
  let skip = 0
  let hasMore = true
  let actions = []

  if (diff < TIME_BEFORE_IRREVERSIBILITY) {
    await sleepUtil(TIME_BEFORE_IRREVERSIBILITY - diff)

    return sync()
  }

  try {
    while (hasMore) {
      ;({ hasMore, actions } = await getActions({ after, before, skip }))
      skip += actions.length

      await runUpdaters(actions)
    }
  } catch (error) {
    console.error('hyperion error', error.message)
    await sleepUtil(5)

    return sync()
  }

  await hyperionStateService.saveOrUpdate(before)

  return sync()
}

const syncWorker = () => {
  return {
    name: 'SYNC ACTIONS',
    action: sync
  }
}

module.exports = {
  syncWorker
}
