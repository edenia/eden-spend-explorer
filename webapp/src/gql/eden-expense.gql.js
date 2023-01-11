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

export const GET_DELEGATES_EXPENSE_BY_ELECTION = gql`
  query getDelegatesByElection($election: Int) {
    historic_expenses(where: { election: { _eq: $election } }) {
      delegate_payer
      usd_categorized
      eos_claimed
      eos_unclaimed
      eos_categorized
    }
  }
`

export const GET_TOTAL_EXPENSE_BY_CATEGORY_AND_ELECTION = gql`
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
      memo
      eden_election {
        election
      }
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
