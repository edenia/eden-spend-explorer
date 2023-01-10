import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Divider } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import { useSharedState } from '../../context/state.context'
import { formatWithThousandSeparator } from '../../utils'
import styles from './styles'

const useStyles = makeStyles(styles)

const RankLabel = {
  NumberedLevel: 'N',
  Chief: 'Chief',
  HeadChief: 'Head Chief'
}

export const RankLevelDistribution = ({
  label,
  EOSamount,
  usdAmount,
  level
}) => {
  const labelText = label === RankLabel.NumberedLevel ? `Level ${level}` : label
  const classes = useStyles()

  return (
    <div className={classes.rankLevelBox}>
      {' '}
      <strong>{labelText}</strong>
      <p>
        {formatWithThousandSeparator(EOSamount, 2) || 0} EOS
        <br />
        {formatWithThousandSeparator(usdAmount, 2) || 0} USD
      </p>
    </div>
  )
}
RankLevelDistribution.propTypes = {
  label: PropTypes.string,
  EOSamount: PropTypes.number,
  usdAmount: PropTypes.number,
  level: PropTypes.number
}

const TreasuryDisbursementsInfo = ({
  delegatesActualElectionList = [],
  ranksList = []
}) => {
  const [state] = useSharedState()
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const { nextEdenDisbursement, eosRate } = state.eosTrasuryBalance
  const { i18n } = useTranslation('translations')
  const { t } = useTranslation('incomeRoute')
  const classes = useStyles()

  const trasuryBalance = Number(
    state.eosTrasuryBalance.currencyBalance.split(' ')[0]
  )

  const electedRanks =
    ranksList.length >= 3 ? ranksList.slice(0, -1) : ranksList

  const electedRanksSize = electedRanks.length
  const totalNextMonthDistribution = trasuryBalance * 0.11 || 0
  const amountPerLevel = totalNextMonthDistribution / electedRanksSize

  const dateFormat = new Date(nextEdenDisbursement).toLocaleDateString(
    i18n.language,
    options
  )

  const calculateAndRenderRankLevelComponent = (delegate, index) => {
    const currentRank = delegate.delegate_level

    const filteredArray = delegatesActualElectionList.filter(
      x => x.delegate_level >= delegate.delegate_level
    )

    const rankAmount = amountPerLevel / filteredArray.length

    const label =
      currentRank === ranksList.at(-1)?.delegate_level
        ? RankLabel.HeadChief
        : currentRank === ranksList.at(-1)?.delegate_level - 1
        ? RankLabel.Chief
        : RankLabel.NumberedLevel

    return (
      <RankLevelDistribution
        label={label}
        level={currentRank}
        EOSamount={rankAmount}
        usdAmount={rankAmount * eosRate}
        key={`rank-level-${label}${index}`}
      />
    )
  }

  return (
    <div>
      <h3>{t('titleDisbursement')}</h3>
      <p>{t('paragraph1Disbursement')}</p>
      <p>{t('paragraph2Disbursement')}</p>
      <p>
        {t('paragraph3Disbursement')} <strong>{dateFormat}</strong>
      </p>
      <Divider variant="middle" />
      <p>{t('paragraph4Disbursement')}</p>
      <div className={classes.disbursementsContainer}>
        {electedRanks.map(calculateAndRenderRankLevelComponent)}
        <div>
          {' '}
          <strong>{t('trasury')}</strong>
          <p>
            {formatWithThousandSeparator(
              trasuryBalance - totalNextMonthDistribution,
              2
            ) || 0}{' '}
            EOS
            <br />
            {formatWithThousandSeparator(
              (trasuryBalance - totalNextMonthDistribution) * eosRate,
              2
            ) || 0}{' '}
            USD
          </p>
        </div>
      </div>
      <Divider variant="middle" />
    </div>
  )
}

TreasuryDisbursementsInfo.propTypes = {
  delegatesActualElectionList: PropTypes.array,
  ranksList: PropTypes.array
}

export default memo(TreasuryDisbursementsInfo)
