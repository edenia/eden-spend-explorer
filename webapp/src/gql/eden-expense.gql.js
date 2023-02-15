import gql from 'graphql-tag'

export const GET_TOTAL_EXPENSE_BY_ALL_ELECTIONS = gql`
  query get_total_expense_by_all_election {
    total_expense_by_all_election {
      election
      eos_categorized
      eos_uncategorized
      percent_categorized
      percent_uncategorized
      usd_categorized
      usd_uncategorized
    }
    eden_historic_election(order_by: { election: asc }) {
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

export const GET_DELEGATES_EXPENSE_BY_ELECTION = gql`
  query getDelegatesByElection($election: numeric) {
    global_amount(where: { election: { _eq: $election } }) {
      account
      election
      eos_income
      usd_income
      eos_expense
      usd_expense
    }
  }
`

export const GET_TOTAL_EXPENSE_BY_CATEGORY_AND_ELECTION = gql`
  query getExpensesByCategoryAndElection($election: Int) {
    expenses_by_category_and_election(where: { election: { _eq: $election } }) {
      total_usd_amount
      category
      total_eos_amount
      election
    }
  }
`

export const GET_TOTAL_EXPENSE_BY_CATEGORY = gql`
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
export const GET_EXPENSES_BY_ACCOUNT = gql`
  query getTransactionsByDelegateAccount($account: String!) {
    eden_transaction(
      where: {
        type: { _eq: "expense" }
        eden_election: { eden_delegate: { account: { _eq: $account } } }
      }
      order_by: { date: desc }
    ) {
      id
      amount
      date
      description
      recipient
      txid
      category
      eden_election {
        election
      }
      digest
    }
  }
`

export const GET_EXPENSE_BY_CATEGORY = gql`
  query getExpenseByCategory($id_election: uuid) {
    total_expense_by_delegate_and_election(
      where: { id_election: { _eq: $id_election } }
    ) {
      category
      eos_amount
      usd_amount
      id
      id_election
      tx_id
    }
  }
`
