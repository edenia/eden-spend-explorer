const moment = require('moment')

const { communityUtil } = require('../utils')
const { edenDelegatesGql } = require('../gql')
const { edenElectionGql } = require('../gql')
const { edenHistoricElectionGql } = require('../gql')
const { servicesConstant } = require('../constants')
const { dfuseConfig } = require('../config')

const updateEdenTable = async () => {
  await communityUtil.saveNewElection(edenHistoricElectionGql)

  let nextKey = null
  const dateActualElection = moment(new Date()).get()
  const actualElection = await edenHistoricElectionGql.get({
    date_election: { _lte: dateActualElection }
  })

  while (true) {
    const members = await communityUtil.loadTableData(
      { next_key: nextKey },
      'member'
    )

    for (const member of members.rows) {
      if (!(member[1].election_rank > 0)) continue

      const memberData = {
        account: member[1].account,
        last_synced_at: dfuseConfig.firstBlock
      }
      let registeredMember = await edenDelegatesGql.get({
        account: { _eq: memberData.account }
      })

      if (!registeredMember)
        registeredMember = await edenDelegatesGql.save(memberData)

      const electionData = {
        id_delegate: registeredMember.id,
        election: actualElection.election,
        delegate_level: member[1].election_rank
      }
      const registeredElection = await edenElectionGql.get({
        id_delegate: { _eq: registeredMember.id },
        election: { _eq: electionData.election }
      })

      if (!registeredElection) await edenElectionGql.save(electionData)
    }

    if (!members.more) break

    nextKey = members.next_key
  }
}

const updateEdenTableWorker = () => {
  return {
    name: servicesConstant.MESSAGES.delegates,
    interval: communityUtil.nextElectionDate,
    action: updateEdenTable
  }
}

module.exports = {
  updateEdenTableWorker
}
