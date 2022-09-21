import gql from 'graphql-tag'

export const GET_INCOME_TRANSACTIONS_DELEGATES_QUERY = gql`
  query getDelegatesByElectionRound($election: Int!) {
    eden_election(
      where: {
        election: { _eq: $election }
        eden_transactions: { type: { _eq: "income" } }
      }
    ) {
      eden_delegate {
        account
      }
      eden_transactions_aggregate(
        where: {
          type: { _eq: "income" }
          eden_election: { election: { _eq: $election } }
        }
      ) {
        aggregate {
          sum {
            amount
            usd_total
          }
          avg {
            eos_exchange
          }
        }
      }
      delegate_level
    }
  }
`
export const GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY = gql`
  query getTransactionsByDelegateAccount($election: Int!, $account: String!) {
    eden_transaction(
      where: {
        type: { _eq: "income" }
        _and: {
          eden_election: { election: { _eq: $election } }
          _and: {
            eden_election: { eden_delegate: { account: { _eq: $account } } }
          }
        }
      }
      order_by: { date: asc }
    ) {
      amount
      usd_total
      eden_election {
        delegate_level
      }
      eos_exchange
    }
    eden_transaction_aggregate(
      where: {
        type: { _eq: "income" }
        eden_election: {
          election: { _eq: $election }
          eden_delegate: { account: { _eq: $account } }
        }
      }
    ) {
      aggregate {
        sum {
          amount
          usd_total
        }
      }
    }
  }
`

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
    incomes_claimed_and_unclaimed(
      where: { election: { _eq: $election } }
      order_by: { date: asc }
    ) {
      usd_total
      recipient
      category
      amount
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
