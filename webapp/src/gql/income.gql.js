import gql from 'graphql-tag'

export const GET_INCOME_TRANSACTIONS_DELEGATES_QUERY = gql`
  query getDelegatesByElectionRound($election_round: Int!) {
    eden_election(
      where: {
        election_round: { _eq: $election_round }
        eden_transactions: { type: { _eq: "income" } }
      }
    ) {
      eden_delegate {
        account
      }
      eden_transactions_aggregate(
        where: {
          type: { _eq: "income" }
          eden_election: { election_round: { _eq: $election_round } }
        }
      ) {
        aggregate {
          sum {
            amount
            usd_total
          }
        }
      }
      delegate_level
    }
    eden_transaction_aggregate(
      where: {
        type: { _eq: "income" }
        eden_election: { election_round: { _eq: $election_round } }
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
export const GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY = gql`
  query getTransactionsByDelegateAccount(
    $election_round: Int!
    $account: String!
  ) {
    eden_transaction(
      where: {
        type: { _eq: "income" }
        _and: {
          eden_election: { election_round: { _eq: $election_round } }
          _and: {
            eden_election: { eden_delegate: { account: { _eq: $account } } }
          }
        }
      }
      order_by: { amount: desc }
    ) {
      amount
      usd_total
      eden_election {
        delegate_level
      }
    }
    eden_transaction_aggregate(
      where: {
        eden_election: {
          election_round: { _eq: $election_round }
          _and: { eden_transactions: { type: { _eq: "income" } } }
        }
        _and: {
          eden_election: { eden_delegate: { account: { _eq: $account } } }
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
    eden_history_election_date(
      where: { date_election: { _gte: $minDate, _lt: $maxDate } }
      distinct_on: election_round
    ) {
      election_round
    }
  }
`
