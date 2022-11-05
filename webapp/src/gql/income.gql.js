import gql from 'graphql-tag'

export const GET_PERCENT_ALL_ELECTIONS_INCOME = gql`
  query getPercentAllElections {
    percent_by_all_elections_incomes {
      eos_claimed
      eos_unclaimed
      usd_claimed
      usd_unclaimed
      election
    }
  }
`

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

export const GET_INCOME_BY_ELECTIONS = gql`
  query getIncomeByElections {
    total_by_category_and_election(where: { type: { _eq: "income" } }) {
      election
      category
      amount
      usd_total
    }
  }
`

export const GET_TOTAL_INCOME_BY_DELEGATE = gql`
  query getTotalIncomeByDelegate {
    incomes_by_delegate {
      recipient
      eos_claimed
      usd_claimed
      eos_unclaimed
      usd_unclaimed
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
