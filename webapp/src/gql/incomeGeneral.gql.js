import gql from 'graphql-tag'

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

export const GET_DELEGATES_BY_ELECTION = gql`
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
