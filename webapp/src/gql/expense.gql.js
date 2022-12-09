import gql from 'graphql-tag'

export const GET_PERCENT_ALL_ELECTIONS_EXPENSE = gql`
  query getPercentAllElections {
    percent_by_all_elections_expenses {
      election
      eos_categorized
      eos_uncategorized
      usd_categorized
      usd_uncategorized
    }
  }
`

export const GET_PERCENT_BY_ELECTION_EXPENSE = gql`
  query getPercentByElections($election: Int) {
    percent_by_delegates_expenses(where: { election: { _eq: $election } }) {
      election
      eos_categorized
      eos_uncategorized
      usd_categorized
      usd_uncategorized
      delegate_payer
    }
  }
`

export const GET_EXPENSE_BY_ELECTIONS = gql`
  query getExpenseByElections {
    total_by_category_and_election(
      where: { type: { _eq: "expense" } }
      order_by: { election: asc, category: asc }
    ) {
      election
      category
      amount
      usd_total
    }
    eden_historic_election {
      election
      date_election
    }
  }
`

export const GET_TOTAL_EXPENSE_BY_DELEGATE = gql`
  query getTotalExpenseByDelegate {
    expenses_by_delegate {
      delegate_payer
      amount
      usd_total
    }
  }
`

export const GET_DELEGATES_BY_ELECTION_EXPENSE = gql`
  query getDelegatesByElection($election: Int) {
    historic_expenses(where: { election: { _eq: $election } }) {
      delegate_payer
      eos_categorized
      usd_categorized
      eos_uncategorized
      usd_uncategorized
    }
  }
`

export const GET_TOTAL_BY_CATEGORY_AND_ELECTION_EXPENSE = gql`
  query getTotalClaimedAndUnclaimedByElection($election: Int) {
    total_by_category_and_election(
      where: { election: { _eq: $election }, type: { _eq: "expense" } }
    ) {
      amount
      category
      election
      usd_total
    }
  }
`

export const GET_TOTAL_BY_CATEGORY_EXPENSE = gql`
  query getTotalByCategory {
    total_by_category(
      where: { category: { _neq: "uncategorized" }, type: { _eq: "expense" } }
    ) {
      amount
      category
      type
      usd_total
    }
  }
`
export const EDIT_TRANSACTION_BY_TXID = gql`
  mutation update(
    $where: eden_transaction_bool_exp!
    $_set: eden_transaction_set_input
  ) {
    update_eden_transaction(where: $where, _set: $_set) {
      returning {
        id
      }
    }
  }
`
