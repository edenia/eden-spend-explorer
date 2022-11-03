import gql from 'graphql-tag'

export const GET_PERCENT_ALL_ELECTIONS = gql`
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

export const GET_PERCENT_BY_ELECTION = gql`
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

export const GET_DELEGATES_BY_ELECTION = gql`
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

export const GET_TOTAL_BY_CATEGORY_AND_ELECTION = gql`
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

export const GET_TOTAL_BY_CATEGORY = gql`
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
