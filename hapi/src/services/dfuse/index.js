const moment = require('moment')

const dfuseStateService = require('../../gql/dfuse-state.gql')
const { dfuseConfig, edenConfig } = require('../../config')
const { transactionConstant } = require('../../constants')
const {
  edenElectionGql,
  edenHistoricElectionGql,
  edenTransactionGql
} = require('../../gql')
const {
  hasuraUtil,
  sleepUtil,
  communityUtil,
  dfuseUtil
} = require('../../utils')

const updaters = require('./updaters')

let LASTEST_RATE_DATE_CONSULTED = null
let LASTEST_RATE_DATA_CONSULTED = null

const getLastSyncedAt = async () => {
  const state = await dfuseStateService.getState()

  if (state) {
    return state.lastSyncedAt
  }

  await dfuseStateService.saveOrUpdate(dfuseConfig.firstBlock)

  return dfuseConfig.firstBlock
}

const runUpdaters = async actions => {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index]
    try {
      const { matchingActions, id } = action?.trace
      for (
        let indexMatching = 0;
        indexMatching < matchingActions.length;
        indexMatching++
      ) {
        const matchingAction = matchingActions[indexMatching]

        if (!transactionConstant.RECEIVER.includes(matchingAction.receiver))
          continue

        const updater = updaters.find(
          item =>
            item.type === `${matchingAction.account}:${matchingAction.name}`
        )
        const electionNumber = await edenHistoricElectionGql.get({
          date_election: { _lte: action.trace.block.timestamp }
        })

        if (!updater || !electionNumber) continue

        const edenElectionId =
          matchingAction.name === 'withdraw'
            ? await edenElectionGql.get({
                eden_delegate: { account: { _eq: matchingAction.json.owner } },
                election: { _eq: electionNumber.election }
              })
            : await edenElectionGql.get({
                eden_delegate: { account: { _eq: matchingAction.json.from } },
                election: { _eq: electionNumber.election }
              })
        const registeredTransaction = await edenTransactionGql.get({
          txid: { _eq: id }
        })

        if (!edenElectionId || registeredTransaction) continue

        const txDate = moment(action.trace.block.timestamp).format('DD-MM-YYYY')

        if (
          LASTEST_RATE_DATE_CONSULTED !== txDate &&
          matchingAction.name !== 'fundtransfer'
        ) {
          try {
            const data = await communityUtil.getExchangeRateByDate(txDate)
            LASTEST_RATE_DATA_CONSULTED = data.market_data.current_price.usd
            LASTEST_RATE_DATE_CONSULTED = txDate
          } catch (error) {
            console.error(
              `error runUpdaters, number of date queries exceeded: ${error.message}`
            )

            await sleepUtil(60)

            return runUpdaters(actions)
          }
        }

        await updater.apply({
          transaction_id: id,
          json: matchingAction.json,
          timestamp: action.trace.block.timestamp,
          ation: matchingAction.name,
          electionId: edenElectionId.id,
          eosPrice: LASTEST_RATE_DATA_CONSULTED
        })
      }
    } catch (error) {
      console.error(
        `error to sync ${action.trace.matchingActions[0].name}: ${error.message}`
      )
    }
  }
}

const getActions = async params => {
  const { data } = await dfuseUtil.client.graphql(
    dfuseUtil.getfundTransferQuery(params)
  )
  const transactionsList = data.searchTransactionsForward.results

  return {
    hasMore: transactionsList.length === 1000,
    actions: transactionsList,
    blockNumber: transactionsList[transactionsList.length - 1].trace.block.num
  }
}

const sync = async () => {
  await hasuraUtil.hasuraAssembled()
  let hasMore = true
  let actions = []
  let blockNumber = await getLastSyncedAt()
  try {
    while (hasMore) {
      ;({ hasMore, actions, blockNumber } = await getActions({
        query: `account:${edenConfig.edenContract} action:fundtransfer OR account:${edenConfig.edenContract} action:withdraw OR account:eosio.token action:transfer`,
        lowBlockNum: blockNumber
      }))

      await runUpdaters(actions)
    }
  } catch (error) {
    console.error('dfuse error', error.message)
  }

  await dfuseStateService.saveOrUpdate(blockNumber)
  await sleepUtil(5)

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