import gql from 'graphql-tag'

export const GET_PERCENT_BY_ELECTIONS_INCOME = gql`
  query getPercentByElections($election: Int) {
    percent_by_delegates_incomes(where: { election: { _eq: $election } }) {
      election
      eos_claimed
      eos_unclaimed
      recipient
      usd_claimed
      usd_unclaimed
    }
  }
`

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
