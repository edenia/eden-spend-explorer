import gql from 'graphql-tag'

export const GET_INCOME_TRANSACTIONS_DELEGATES_QUERY = gql`
  query getDelegatesByElectionRound($election: Int!) {
    eden_election(
      where: {
        election: { _eq: $election }
        eden_transactions: { type: { _eq: "income" } }
      }
    ) {
      eden_delegate {
        account
      }
      eden_transactions_aggregate(
        where: {
          type: { _eq: "income" }
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
      usd_claimed
      usd_unclaimed
      recipient
      eos_claimed
      eos_unclaimed
      exchange_rate
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

export const GET_PERCENT_ALL_ELECTIONS = gql`
  query getPercentAllElections {
    percent_by_all_elections_incomes {
      eos_claimed
      eos_unclaimed
      usd_claimed
      usd_unclaimed
      election
    }
  }
`

export const GET_PERCENT_BY_ELECTIONS = gql`
  query getPercentByElections($election: Int) {
    percent_by_delegates_incomes(where: { election: { _eq: $election } }) {
      election
      eos_claimed
      eos_unclaimed
      recipient
      usd_claimed
      usd_unclaimed
    }
  }
`
