const moment = require('moment')

const { communityUtil } = require('../utils')
const { edenDelegatesGql } = require('../gql')
const { edenElectionGql } = require('../gql')
const { edenHistoricElectionGql } = require('../gql')
const { servicesConstant } = require('../constants')

const saveNewHistoricElection = async () => {
  const currentDate = moment().format()
  const lastElection = await edenHistoricElectionGql.get({
    date_election: { _lte: currentDate }
  })

  const electState = await communityUtil.loadTableData(
    { next_key: null },
    'elect.state'
  )
  const electStateData = electState.rows[0]
  const nextElection = electStateData[1].last_election_time.split('T')[0]

  if (lastElection.date_election.split('T')[0] === nextElection) return

  const newElectionData = {
    election: lastElection.election + 1,
    date_election: nextElection
  }

  await edenHistoricElectionGql.save(newElectionData)
}

const updateEdenTable = async () => {
  await saveNewHistoricElection()

  let nextKey = null
  while (true) {
    const members = await communityUtil.loadTableData(
      { next_key: nextKey },
      'member'
    )

    for (const member of members.rows) {
      if (!(member[1].election_rank > 0)) continue

      const memberData = {
        account: member[1].account
      }
      let registeredMember = await edenDelegatesGql.get({
        account: { _eq: memberData.account }
      })

      if (!registeredMember)
        registeredMember = await edenDelegatesGql.save(memberData)

      const electionData = {
        id_delegate: registeredMember.id,
        election: parseInt(member[0].slice(8)) + 1,
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
