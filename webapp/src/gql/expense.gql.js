import gql from 'graphql-tag'

export const GET_ELECTIONS_BY_YEAR = gql`
  query getElectionsBydate($minDate: timestamptz!, $maxDate: timestamptz!) {
    eden_historic_election(
      where: { date_election: { _gte: $minDate, _lt: $maxDate } }
      distinct_on: election
    ) {
      election
    }
  }
`
export const GET_TOTAL_INCOME_BY_ELECTIONS_QUERY = gql`
  query getTotalIncomeByElection {
    total_income_by_election {
      amount
      usd_total
      election
    }
  }
`

export const GET_INCOMES_CLAIMED_AND_UNCLAIMED_BY_ELECTION = gql`
  query getIncomesClaimedAndUnclaimedByElection($election: Int) {
    historic_incomes(where: { election: { _eq: $election } }) {
      usd_claimed
      usd_unclaimed
      recipient
      eos_claimed
      eos_unclaimed
      exchange_rate
    }
  }
`

export const GET_TOTAL_CLAIMED_AND_UNCLAIMED = gql`
  query getTotalClaimedAndUnclaimed {
    total_claimed_and_unclaimed {
      amount
      category
      usd_total
    }
  }
`

export const GET_TOTAL_CLAIMED_AND_UNCLAIMED_BY_ELECTION = gql`
  query getTotalClaimedAndUnclaimedByElection($election: Int) {
    total_claimed_and_unclaimed_by_election(
      where: { election: { _eq: $election } }
    ) {
      amount
      category
      election
      usd_total
    }
  }
`

export const GET_PERCENT_ALL_ELECTIONS = gql`
  query getPercentAllElections {
    percent_by_all_elections {
      eos_claimed
      eos_unclaimed
      usd_claimed
      usd_unclaimed
      election
    }
  }
`

export const GET_PERCENT_BY_ELECTIONS = gql`
  query getPercentByElections($election: Int) {
    percent_by_delegates(where: { election: { _eq: $election } }) {
      election
      eos_claimed
      eos_unclaimed
      recipient
      usd_claimed
      usd_unclaimed
    }
  }
`

export const GET_PERCENT_BY_DELEGATES = gql`
  query getPercentByDelegate($election: Int, $delegate: String = "") {
    percent_by_delegates(
      where: { election: { _eq: $election }, recipient: { _eq: $delegate } }
    ) {
      election
      eos_claimed
      eos_unclaimed
      recipient
      usd_claimed
      usd_unclaimed
    }
  }
`
