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
