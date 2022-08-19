import gql from 'graphql-tag'

export const INCOME_TRANSACTIONS_BY_DELEGATE_QUERY = gql`
  query transactionsByDelegate {
    eden_transaction(
      distinct_on: recipient
      where: { type: { _eq: "income" } }
    ) {
      eden_election {
        eden_delegate {
          account
        }
        eden_transactions_aggregate {
          aggregate {
            sum {
              amount
              usd_total
            }
          }
        }
      }
    }
  }
`
