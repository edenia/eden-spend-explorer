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
export const GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY = gql`
  query getDelegatesByElectionRound($election: Int!) {
    eden_election(
      where: {
        election: { _eq: $election }
        eden_transactions: { type: { _eq: "expense" } }
      }
    ) {
      eden_delegate {
        account
      }
      eden_transactions_aggregate(
        where: {
          type: { _eq: "expense" }
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
      election
    }
  }
`

export const GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY = gql`
query getTransactionsByDelegateAccount($election: Int!, $account: String!) {
  eden_transaction(
    where: {
      type: { _eq: "expense" }
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
      election
    }
    date
    eos_exchange
    txid
    category
  }

}
