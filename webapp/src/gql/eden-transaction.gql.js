import gql from 'graphql-tag'

export const GET_TOTAL_EXPENSE_BY_ELECTION = gql`
  query getTotalExpenseByDelegateView($election: numeric, $account: String) {
    global_amount(
      where: { election: { _eq: $election }, account: { _eq: $account } }
    ) {
      election
      eos_expense
      usd_expense
    }
  }
`

export const GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION = gql`
  query getTransactionsByDelegateAndElection(
    $election: Int
    $delegate: String
  ) {
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

export const SAVE_TRANSACTION = gql`
  mutation saveTransaction($payload: eden_transaction_insert_input!) {
    insert_eden_transaction_one(object: $payload) {
      id
    }
  }
`
