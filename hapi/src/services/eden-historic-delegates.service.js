const { edenConfig } = require('../config')
const { servicesConstant } = require('../constants')
const { eosUtil, dfuseUtil, communityUtil, sleepUtil } = require('../utils')
const {
  edenDelegatesGql,
  edenHistoricElectionGql,
  edenElectionGql
} = require('../gql')

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

const getActions = async params => {
  const { data } = await dfuseUtil.client.graphql(
    dfuseUtil.getfundTransferQuery(params)
  )

  return {
    hasMore: data.searchTransactionsForward.results.length === 1000,
    actions: data.searchTransactionsForward.results,
    blockNumber:
      data.searchTransactionsForward.results[
        data.searchTransactionsForward.results.length - 1
      ].trace.block.num
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

const runDelegateUpdaters = async actions => {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index]
    try {
      const { matchingActions } = action.trace

      for (let indexMach = 0; indexMach < matchingActions.length; indexMach++) {
        const { json } = matchingActions[indexMach]
        const date = json.distribution_time
        const rank = json.rank
        const account = json.from
        await registerHistoricDelegate(date, account, rank)
      }
    } catch (error) {
      console.error(
        `error to runDelegateUpdaters ${action.trace.matchingActions[0].name}: ${error.message}`
      )
    }
  }
}

const saveDelegateByFundTransfer = async () => {
  let hasMore = true
  let actions = []
  let blockNumber = null
  try {
    while (hasMore) {
      ;({ hasMore, actions, blockNumber } = await getActions({
        query: `account:${edenConfig.edenContract} action:fundtransfer`,
        lowBlockNum: blockNumber
      }))

      await runDelegateUpdaters(actions)
    }
  } catch (error) {
    console.error('save delegate by fundTransfer error: ', error.message)
    await sleepUtil(60)
    saveDelegateByFundTransfer()
  }
}

const saveDelegateByDistAccount = async () => {
  let nextKey = null
  try {
    while (true) {
      const delegates = await historicDelegates({ next_key: nextKey })

      for (const delegate of delegates.rows) {
        const date = delegate[1].distribution_time
        const account = delegate[1].owner
        const rank = delegate[1].rank
        await registerHistoricDelegate(date, account, rank)
      }

      if (!delegates.more) break

      nextKey = delegates.next_key
    }
  } catch (error) {
    console.error('save delegate by disaccount error: ', error.message)
    await sleepUtil(60)
    saveDelegateByDistAccount()
  }
}

const saveHistoricElection = async () => {
  const historicElectionsList = edenConfig.edenElectionHistorics || []

  await historicElectionsList.forEach(async element => {
    const election = await edenHistoricElectionGql.get({
      election: { _eq: element.election }
    })

    if (election) return

    await edenHistoricElectionGql.save({
      election: element.election,
      date_election: element.date_election
    })
  })

  await sleepUtil(5)
}

const updateHistoricDelegate = async () => {
  await saveHistoricElection()
  await communityUtil.saveNewElection(edenHistoricElectionGql)
  await saveDelegateByDistAccount()
  await saveDelegateByFundTransfer()
}

const updateHistoricDelegatesWorker = () => {
  return {
    name: servicesConstant.MESSAGES.historicDelegates,
    action: updateHistoricDelegate
  }
}

module.exports = {
  updateHistoricDelegatesWorker
}
