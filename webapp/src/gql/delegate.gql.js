import gql from 'graphql-tag'

// export const GET_PERCENT_ALL_ELECTIONS = gql`
//   query getPercentAllElections {
//     percent_by_all_elections_incomes {
//       eos_claimed
//       eos_unclaimed
//       usd_claimed
//       usd_unclaimed
//       election
//     }
//   }
// `

// export const GET_PERCENT_BY_ELECTIONS = gql`
//   query getPercentByElections($election: Int) {
//     percent_by_delegates_incomes(where: { election: { _eq: $election } }) {
//       election
//       eos_claimed
//       eos_unclaimed
//       recipient
//       usd_claimed
//       usd_unclaimed
//     }
//   }
// `

export const GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY = gql`
  query getTransactionsByDelegateAccount($election: Int!, $account: String!) {
    eden_transaction(
      where: {
        type: { _eq: "income" }
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
    eden_transaction_aggregate(
      where: {
        type: { _eq: "income" }
        eden_election: {
          election: { _eq: $election }
          eden_delegate: { account: { _eq: $account } }
        }
      }
    ) {
      aggregate {
        sum {
          amount
          usd_total
        }
      }
    }
  }
`

export const GET_TOTAL_BY_ELECTIONS_QUERY = gql`
  query getTotalIncomeByElection {
    total_by_election(where: { type: { _eq: "income" } }) {
      amount
      usd_total
      election
    }
  }
`

export const GET_INCOMES_CLAIMED_AND_UNCLAIMED_BY_ELECTION = gql`
  query getIncomesClaimedAndUnclaimedByElection($election: Int) {
    historic_incomes(where: { election: { _eq: $election } }) {
      recipient
      eos_claimed
      usd_claimed
      eos_unclaimed
      usd_unclaimed
    }
  }
`

export const GET_TOTAL_BY_CATEGORY = gql`
  query getTotalClaimedAndUnclaimed {
    total_by_category(where: { type: { _eq: "income" } }) {
      amount
      category
      usd_total
    }
  }
`

export const GET_TOTAL_CLAIMED = gql`
  query getTotalClaimed {
    total_by_category_and_election(
      where: { type: { _eq: "income" }, category: { _eq: "claimed" } }
    ) {
      election
      amount
      usd_total
    }
  }
`

export const GET_TOTAL_BY_CATEGORY_AND_ELECTION = gql`
  query getTotalClaimedAndUnclaimedByElection($election: Int) {
    total_by_category_and_election(
      where: { election: { _eq: $election }, type: { _eq: "income" } }
    ) {
      amount
      category
      election
      usd_total
    }
  }
`

export const GET_INCOME_BY_ELECTION_AND_DELEGATE = gql`
  query getIncomeByElectionAndDelegate($delegate: String, $election: Int) {
    historic_incomes(
      where: { recipient: { _eq: $delegate }, election: { _eq: $election } }
    ) {
      eos_claimed
      eos_unclaimed
      usd_claimed
      usd_unclaimed
    }
  }
`

export const GET_INCOME_CATEGORIES_BY_ELECTION_AND_DELEGATE = gql`
  query getIncomeCategoriesByElectionAndDelegate(
    $delegate: String
    $election: Int
  ) {
    transaction_by_category_and_election(
      where: {
        delegate_payer: { _eq: $delegate }
        election: { _eq: $election }
        type: { _eq: "income" }
      }
    ) {
      amount
      usd_total
      category
    }
  }
`
