import gql from 'graphql-tag'

export const GET_TOTAL_INCOME_BY_ALL_ELECTIONS = gql`
  query get_total_expense_by_all_election {
    total_income_by_all_elections {
      election
      eos_claimed
      eos_unclaimed
      percent_claimed
      percent_unclaimed
      usd_claimed
      usd_unclaimed
    }
    eden_historic_election {
      election
      date_election
    }
  }
`

export const GET_TREASURY = gql`
  query getTreasury {
    eden_treasury(order_by: { date: asc }) {
      balance
      usd_total
      date
    }
  }
`

export const GET_TOTAL_DELEGATE_INCOME_BY_ELECTION = gql`
  query getTotalDelegateIncomeByElection($where: historic_incomes_bool_exp) {
    historic_incomes(where: $where) {
      recipient
      eos_claimed
      usd_claimed
      eos_unclaimed
      usd_unclaimed
      election
      delegate_level
    }
  }
`
export const GET_TOTAL_INCOME_BY_DELEGATE = gql`
  query getTotalIncomeByDelegate {
    incomes_by_delegate {
      recipient
      eos_claimed
      usd_claimed
      eos_unclaimed
      usd_unclaimed
    }
  }
`
