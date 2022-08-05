const { edenConfig } = require('../config')
const { eosUtil } = require('../utils')
const {edenDelegatesGql} = require('../gql')
const { edenElectionGql } = require('../gql')

const loadMembers = async ({ next_key: nextKey = null, limit = 100 } = {}) => {
  return await eosUtil.getTableRows({
    code: 'genesis.eden',
    scope: 0,
    table: 'member',
    limit,
    lower_bound: nextKey
  })
}

const updateEdenTableElection = async () => {
  let nextKey = null

  while (true) {
    const members = await loadMembers({ next_key: nextKey })

    for (const member of members.rows) {
      if (!member[1].election_rank > 0) continue
      
      const registeredMember = await edenDelegatesGql.get({
        account: { _eq: member[1].account },
      })
      
      const electionData = {
        id_delegate: registeredMember.id,
        election_round: parseInt(member[0].slice(8)) + 1,
        delegate_level: member[1].election_rank,
      }

      const registeredDelegate = await edenElectionGql.get({
        id_delegate: { _eq: registeredMember.id },
        election_round: { _eq: electionData.election_round },
      })

      if (!registeredDelegate) await edenElectionGql.save(electionData)
    }

    if (!members.more) break

    nextKey = members.next_key
  }
}

const updateEdenElection = () => {
  return {
    name: 'UPDATE EDEN ELECTION',
    interval: edenConfig.edenElectionInterval,
    action: updateEdenTableElection
  }
}

module.exports = {
  updateEdenElection
}
