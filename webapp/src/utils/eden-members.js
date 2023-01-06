import { gql, GraphQLClient } from 'graphql-request'

import { mainConfig } from '../../src/config'
import { GET_MEMBERS_DATA } from '../gql'

const client = new GraphQLClient(`${mainConfig.urlEndpoint}/v1/graphql`, {
  headers: {}
})

export const getDelegatesProfileInformation = async (delegates, maxLevel) => {
  const variables = {
    value: delegates.map(delegate => delegate.recipient),
    orderBy: {
      election_rank: 'desc'
    },
    limit: 50
  }

  const { members } = await client.request(
    gql`
      ${GET_MEMBERS_DATA}
    `,
    variables
  )

  return members.map(member => {
    const posDelegate = delegates.find(
      delegate => delegate.recipient === member.account
    )

    if (posDelegate) {
      const rank = classifyMemberRank(posDelegate.delegate_level, maxLevel)

      return {
        ...member,
        rank,
        totalRewarded: posDelegate.eos_claimed + posDelegate.eos_unclaimed
      }
    }

    return member
  })
}

const RankType = {
  Member: 0,
  N: 1,
  Chief: 2,
  HeadChief: 3
}

const BadgeLink = {
  Delegate: '/icons/chiefdelegate-icon.png',
  N: '/icons/lv1-icon.png'
}

export const classifyMemberRank = (rank, electionRankSize) => {
  let memberType = 0
  let label
  let badge
  let voteWeight = '1'

  switch (true) {
    case rank === electionRankSize:
      memberType = RankType.HeadChief
      badge = BadgeLink.Delegate
      break

    case rank === electionRankSize - 1:
      memberType = RankType.Chief
      badge = BadgeLink.Delegate
      break

    case rank !== 0:
      memberType = RankType.N
      badge = BadgeLink.N

      break

    default:
      memberType = RankType.Member
      break
  }

  switch (true) {
    case RankType.Member === memberType:
      label = 'Member'
      voteWeight = '1'
      break

    case RankType.N === memberType:
      label = `Level ${rank} Delegate`
      voteWeight = '4'
      break

    case RankType.Chief === memberType:
      label = 'Chief Delegate'
      voteWeight = '16'

      break

    default:
      label = 'Head Chief Delegate'
      voteWeight = '16'
      break
  }

  return {
    memberType,
    label,
    badge,
    voteWeight
  }
}
