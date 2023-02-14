import gql from 'graphql-tag'

export const GET_TOTAL_EXPENSE_BY_ELECTION = gql`
  query getTotalExpenseByDelegateView($id_election: uuid) {
    total_expense_by_election_view(
      where: { id_election: { _eq: $id_election } }
    ) {
      id_election
      total_eos_amount
      total_usd_amount
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
      eos_claimed
      usd_categorized
      eos_unclaimed
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
