import gql from 'graphql-tag'

export const GET_ELECTIONS = gql`
  query ($where: eden_election_bool_exp) {
    eden_election(
      order_by: { election: asc }
      distinct_on: election
      where: $where
    ) {
      id
      id_delegate
      delegate_level
      election
      created_at
      updated_at
    }
  }
`

export const GET_DELEGATES = gql`
  query MyQuery($delegate: String) {
    eden_delegates(where: { account: { _eq: $delegate } }) {
      account
    }
  }
`

export const GET_AGGREGATE_TRANSACTION = gql`
  query ($where: eden_transaction_bool_exp) {
    eden_transaction_aggregate(where: $where) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`
