const { edenElectionGql } = require('../../../gql')
const { edenHistoricElectionGql } = require('../../../gql')
const { edenDelegatesGql } = require('../../../gql')
const { eosUtil } = require('../../../utils')

module.exports = {
  type: `genesis:fundtransfer`,
  apply: async action => {
    try {
      const election = await edenHistoricElectionGql.get({
        date_election: { _lte: action.data.distribution_time }
      })

      let registeredMember = await edenDelegatesGql.get({
        account: { _eq: action.data.to }
      })

      if (!registeredMember)
        registeredMember = await edenDelegatesGql.save(action.data.to)

      const electionData = {
        id_delegate: registeredMember.id,
        election_round: election.election_round,
        delegate_level: action.data.rank
      }

      const registeredElection = await edenElectionGql.get({
        id_delegate: { _eq: registeredMember.id },
        election_round: { _eq: electionData.election_round }
      })

      if (!registeredElection) await edenElectionGql.save(electionData)

      if (registeredElection.delegate_level < electionData.delegate_level) {
        const rank = electionData.delegate_level
        await edenElectionGql.update(
          {
            id_delegate: { _eq: electionData.id_delegate },
            election_round: { _eq: electionData.election_round }
          },
          {
            delegate_level: { rank }
          }
        )
      }
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
