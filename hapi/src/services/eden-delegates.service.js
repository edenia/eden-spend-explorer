const { edenConfig } = require('../config')
const { eosUtil } = require('../utils')
const { edenDelegatesGql } = require('../gql')

const loadMembers = async ({ next_key: nextKey = null, limit = 100 } = {}) => {
  return await eosUtil.getTableRows({
    code: 'genesis.eden',
    scope: 0,
    table: 'member',
    limit,
    lower_bound: nextKey
  })
}

const updateEdenTable = async () => {
  let nextKey = null

  while (true) {
    const members = await loadMembers({ next_key: nextKey })

    for (const member of members.rows) {
      if (!member[1].election_rank > 0) continue

      const memberData = {
        account: member[1].account,
        election_round: parseInt(member[0].slice(8)) + 1,
        delegate_level: member[1].election_rank
      }

      const registeredMember = await edenDelegatesGql.get({
        account: { _eq: memberData.account },
        election_round: { _eq: memberData.election_round },
        delegate_level: { _eq: memberData.delegate_level }
      })

      if (!registeredMember) await edenDelegatesGql.save(memberData)
    }

    if (!members.more) break

    nextKey = members.next_key
  }
}

const updateEdenTableWorker = () => {
  return {
    name: 'UPDATE EDEN MEMBERS',
    interval: edenConfig.edenElectionInterval,
    action: updateEdenTable
  }
}

module.exports = {
  updateEdenTableWorker
}
