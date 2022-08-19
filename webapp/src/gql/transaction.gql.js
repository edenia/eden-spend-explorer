import gql from 'graphql-tag'

export const TRANSACTIONS_QUERY = gql`
  query transaction {
    eden_transaction(where: { type: { _eq: "income" } }) {
      usd_total
      amount
      eden_election {
        eden_delegate {
          account
        }
      }
    }
  }
`
