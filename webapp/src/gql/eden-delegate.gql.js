import gql from 'graphql-tag'

export const GET_DELEGATES = gql`
  query MyQuery($delegate: String) {
    eden_delegates(where: { account: { _eq: $delegate } }) {
      account
    }
  }
`
export const GET_MAX_DELEGATE_LEVEL = gql`
  query getMaxDelegateLevel($election: Int) {
    eden_election(
      where: { election: { _eq: $election } }
      order_by: { delegate_level: desc }
      limit: 1
    ) {
      delegate_level
    }
  }
`
export const GET_MEMBERS_DATA = `
  query getMembers($value: [String], $orderBy: [member_order_by!], $limit: Int) {
    memberPag: member_aggregate(
      order_by: $orderBy
      where: { account: { _in: $value } }
    ) {
      aggregate {
        count
      }
    }
    members: member(
      limit: $limit
      order_by: $orderBy
      where: { account: { _in: $value } }
    ) {
      account
      election_participation_status
      election_rank
      encryption_key
      name
      nft_template_id
      profile
      representative
      status
      eosioVoters: eosio_voters {
        producers
        proxy
      }
      vote {
        account
        producers
        weight
      }
    }
  }
`
