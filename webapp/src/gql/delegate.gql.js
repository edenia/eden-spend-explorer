import gql from 'graphql-tag'

export const GET_DELEGATES_BY_ELECTION = gql`
  query getDelegatesByElection($election: Int) {
    transaction_by_category_and_election(
      where: { election: { _eq: $election } }
      distinct_on: delegate_payer
    ) {
      delegate_payer
    }
  }
`

export const GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION = gql`
  query getTransactionsByDelegateAndElection(
    $election: Int
    $delegate: String
  ) {
    historic_expenses(
      where: {
        election: { _eq: $election }
        delegate_payer: { _eq: $delegate }
      }
    ) {
      eos_categorized
      eos_uncategorized
      usd_categorized
      usd_uncategorized
    }
    historic_incomes(
      where: { election: { _eq: $election }, recipient: { _eq: $delegate } }
    ) {
      eos_claimed
      eos_unclaimed
      usd_claimed
      usd_unclaimed
    }
  }
`

export const GET_EXPENSE_BY_CATEGORY = gql`
  query getExpenseByCategory($election: Int, $delegate: String) {
    transaction_by_category_and_election(
      where: {
        type: { _eq: "expense" }
        delegate_payer: { _eq: $delegate }
        election: { _eq: $election }
      }
    ) {
      category
      amount
      usd_total
    }
  }
`
