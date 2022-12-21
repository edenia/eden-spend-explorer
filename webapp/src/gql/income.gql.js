import gql from 'graphql-tag'

export const GET_GENERAL_INCOME = gql`
  query getGeneralIncome {
    incomeFrontend {
      data
    }
  }
`

export const GET_DELEGATES_BY_ELECTION_INCOME = gql`
  query getIncomesClaimedAndUnclaimedByElection($election: Int) {
    historic_incomes(where: { election: { _eq: $election } }) {
      recipient
      eos_claimed
      usd_claimed
      eos_unclaimed
      usd_unclaimed
    }
  }
`
