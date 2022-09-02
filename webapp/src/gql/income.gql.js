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
        }
      }
      delegate_level
    }
    eden_transaction_aggregate(
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
      }
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
          election: { _eq: $election }
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
    eden_election(
      where: { created_at: { _gte: $minDate, _lt: $maxDate } }
      distinct_on: election
    ) {
      election
    }
  }
`
