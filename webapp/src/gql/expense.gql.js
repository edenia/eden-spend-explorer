import gql from 'graphql-tag'

export const GET_EXPENSE_ELECTIONS_BY_YEAR = gql`
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
        eden_transactions: {
          type: { _eq: "expense" }
          category: { _neq: "uncategorized" }
        }
      }
    ) {
      eden_delegate {
        account
      }
      eden_transactions_aggregate(
        where: {
          type: { _eq: "expense" }
          eden_election: { election: { _eq: $election } }
          category: { _neq: "uncategorized" }
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
        category: { _neq: "uncategorized" }
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
`

export const GET_TOTAL_EXPENSE_BY_ELECTIONS_QUERY = gql`
  query getTotalExpenseByElection {
    total_by_election(where: { type: { _eq: "expense" } }) {
      amount
      usd_total
      election
    }
  }
`

export const GET_TOTAL_EXPENSE_BY_CATEGORY = gql`
  query getTotalCategorizedAndUncategorized {
    total_by_category(where: { type: { _eq: "expense" } }) {
      amount
      category
      usd_total
    }
  }
`

export const GET_CATEGORIZED_AND_UNCATEGORIZED_BY_ELECTION = gql`
  query getExpensesClaimedAndUnclaimedByElection($election: Int) {
    historic_expenses(where: { election: { _eq: $election } }) {
      usd_categorized
      usd_uncategorized
      eos_categorized
      eos_uncategorized
      exchange_rate
      election
      delegate_payer
    }
  }
`

export const GET_PERCENT_EXPENSES_ALL_ELECTIONS = gql`
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
export const GET_PERCENT_EXPENSES_BY_ELECTION = gql`
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
