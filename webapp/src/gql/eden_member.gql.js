import gql from 'graphql-request'

export const GET_MEMBERS_DATA = gql`
  {
    memberPag: member_aggregate(
      order_by: $orderBy
      where: { name: { _ilike: $value } }
    ) {
      aggregate {
        count
      }
    }
    members: member(
      limit: $limit
      order_by: $orderBy
      where: { name: { _ilike: $value } }
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
