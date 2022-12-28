import gql from 'graphql-tag'

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

export const GET_ELECTIONS = gql`
  query ($where: eden_election_bool_exp) {
    eden_election(where: $where, order_by: { election: asc }) {
      id
      id_delegate
      delegate_level
      election
      created_at
      updated_at
    }
  }
`

export const GET_DELEGATES = gql`
  query MyQuery($delegate: String) {
    eden_delegates(where: { account: { _eq: $delegate } }) {
      account
    }
  }
`
