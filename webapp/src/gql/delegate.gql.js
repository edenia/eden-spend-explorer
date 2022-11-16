import gql from 'graphql-tag'

export const GET_DELEGATES_BY_ELECTION = gql`
  query getDelegatesByElection($election: Int) {
    transaction_by_category_and_election(
      where: { election: { _eq: $election } }
      distinct_on: delegate_payer
    ) {
      delegate_payer
      delegate_level
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
  query getExpenseByCategory($delegate: String, $election: Int) {
    expenses_by_category_and_delegate(
      where: {
        election: { _eq: $election }
        delegate_payer: { _eq: $delegate }
      }
    ) {
      category
      amount
      usd_total
    }
  }
`

export const GET_MAX_DELEGATE_LEVEL = gql`
  query getMaxDelegateLevel($election: Int) {
    eden_election(
      where: { election: { _eq: $election } }
      order_by: { delegate_level: desc }
      limit: 1
    ) {
      delegate_level
    }
  }
`

export const GET_INCOME_BY_ELECTION = gql`
  query MyQuery($election: Int) {
    historic_incomes(where: { election: { _eq: $election } }) {
      recipient
      eos_claimed
      eos_unclaimed
    }
  }
`
export const GET_DATE_ELECTION = gql`
  query getDateElection($election: Int) {
    eden_historic_election(where: { election: { _eq: $election } }) {
      date_election
    }
  }
`
