const {
  edenDelegatesGql,
  edenElectionGql,
  edenHistoricElectionGql
} = require('../../../gql')

module.exports = {
  type: `genesis:fundtransfer`,
  apply: async action => {
    try {
      const election = edenHistoricElectionGql.get(
        action.data.distribution_time
      )

      let registeredMember = await edenDelegatesGql.get({
        account: { _eq: action.data.to }
      })

      if (!registeredMember)
        registeredMember = await edenDelegatesGql.save(memberData)

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

      if (registeredElection.delegate_level < electionData.delegate_level)
        await edenElectionGql.updateDelegateLevel(
          electionData.id_delegate,
          electionData.election_round,
          electionData.delegate_level
        )
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
