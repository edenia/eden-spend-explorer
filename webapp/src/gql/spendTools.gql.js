import gql from 'graphql-tag'

export const GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY = gql`
  query getTransactionsByDelegateAccount($account: String!) {
    eden_transaction(
      where: {
        type: { _eq: "expense" }
        eden_election: { eden_delegate: { account: { _eq: $account } } }
      }
    ) {
      amount
      date
      description
      recipient
      txid
      category
      eden_election {
        election
      }
    }
  }
`

export const GET_CATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY = gql`
  query getTransactionsByDelegateAccount(
    $account: String!
    $category: String!
    $election: int!
  ) {
    eden_transaction_aggregate(
      where: {
        eden_election: {
          eden_delegate: { account: { _eq: $account } }
          election: { _eq: $election }
        }
        type: { _eq: "expense" }
        category: { _neq: $category }
      }
      distinct_on: txid
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`
export const GET_ACTUAL_ELECTION_QUERY = gql`
  query historicElection {
    eden_historic_election(limit: 1, order_by: { election: desc }) {
      election
    }
  }
`
