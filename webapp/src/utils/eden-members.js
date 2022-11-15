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
