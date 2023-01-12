const {
  edenElectionGql,
  edenHistoricElectionGql,
  edenDelegatesGql,
  edenTreasury
} = require('../../gql')
const { edenConfig, dfuseConfig } = require('../../config')
const { hasuraUtil, sleepUtil, dfuseUtil } = require('../../utils')

const updaters = require('./updaters')

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
        const updater = updaters.find(
          item =>
            item.type === `${matchingAction.account}:${matchingAction.name}`
        )

        if (!updater) continue

        if (matchingAction.name === 'categorize') {
          await updater.apply({
            json: matchingAction.json
          })

          continue
        }

        const timestamp =
          matchingAction.name === 'fundtransfer'
            ? matchingAction.json.distribution_time
            : action.trace.block.timestamp
        const electionNumber = await edenHistoricElectionGql.get({
          date_election: { _lte: timestamp }
        })

        if (!electionNumber) continue

        const edenElectionId =
          (await edenElectionGql.get({
            eden_delegate: { account: { _eq: matchingAction.json.from } },
            election: { _eq: electionNumber.election }
          })) ||
          (
            await edenElectionGql.get(
              {
                eden_delegate: { account: { _eq: matchingAction.json.from } }
              },
              true
            )
          ).find(round => round.election <= electionNumber.election)

        if (!edenElectionId) continue

        await updater.apply({
          transaction_id: id,
          json: matchingAction.json,
          timestamp,
          ation: matchingAction.name,
          election: edenElectionId,
          updater
        })
      }
    } catch (error) {
      console.error(
        `error to sync ${action.trace.matchingActions[0].name}: ${error.message}`
      )
    }
  }
}

const updateTreasury = async (actions, balance) => {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index]
    try {
      const { matchingActions, id, block } = action?.trace
      const matchingAction = matchingActions[0]

      const amount = Number(matchingAction.json.quantity.split(' ')[0] || 0)
      const blockNum = block.num
      const date = block.timestamp
      const type =
        matchingAction.json.from === edenConfig.edenContract
          ? 'Send'
          : 'Receive'

      type === 'Send' ? (balance -= amount) : (balance += amount)
      const updater = updaters.find(
        element => element.type === 'edentreasury:transfer'
      )
      updater.apply({
        id,
        amount,
        balance,
        blockNum,
        date,
        type,
        updater
      })
    } catch (error) {
      console.error(
        `error to sync updateTreasury ${action.trace.matchingAction}: ${error.message}`
      )
    }
  }
  return balance
}

const getActions = async (params, type = 'delegates') => {
  const { data } = await dfuseUtil.client.graphql(
    dfuseUtil.getfundTransferQuery(params)
  )
  const transactionsList = data?.searchTransactionsForward.results || []

  const firstBlock =
    type === 'treasury'
      ? dfuseConfig.firstTreasuryBlock
      : dfuseConfig.firstBlock

  return {
    hasMore: transactionsList.length === 1000,
    actions: transactionsList,
    blockNumber: transactionsList.at(-1)?.trace.block.num || firstBlock
  }
}

const getDelegateData = async () => {
  await hasuraUtil.hasuraAssembled()
  const delegatesList = await edenDelegatesGql.get({}, true)

  for (let index = 0; index < delegatesList.length; index++) {
    const delegate = delegatesList[index]
    let hasMore = true
    let actions = []
    let blockNumber = delegate.last_synced_at
    try {
      while (hasMore) {
        ;({ hasMore, actions, blockNumber } = await getActions({
          query: `account:${edenConfig.edenContract} data.from:${delegate.account} data.to:${delegate.account} OR account:eosio.token data.from:${delegate.account} receiver:eosio.token OR data.account:${delegate.account} receiver:edenexplorer`,
          lowBlockNum: blockNumber
        }))

        await runUpdaters(actions)
        await edenDelegatesGql.update(delegate.id, blockNumber)
        await sleepUtil(10)
      }
    } catch (error) {
      console.error('dfuse error', error.message)
    }
  }

  await sleepUtil(10)
}

const getTreasuryData = async () => {
  const treasuryList = await edenTreasury.get({}, true)

  let blockNumber = dfuseConfig.firstTreasuryBlock
  let balance = 0

  if (treasuryList.length > 0) {
    blockNumber = treasuryList[treasuryList.length - 1].last_synced_at
    balance = treasuryList[treasuryList.length - 1].balance
  }

  let hasMore = true
  let actions = []
  try {
    while (hasMore) {
      ;({ hasMore, actions, blockNumber } = await getActions(
        {
          query: `receiver:eosio.token action:transfer (data.from:${edenConfig.edenContract} OR data.to:${edenConfig.edenContract})`,
          lowBlockNum: blockNumber
        },
        'treasury'
      ))

      balance = await updateTreasury(actions, balance)
      await sleepUtil(10)
    }
  } catch (error) {
    console.error('dfuse error', error.message)
  }
}

const sync = async () => {
  await getTreasuryData()
  await getDelegateData()

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
