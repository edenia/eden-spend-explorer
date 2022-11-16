import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'
import { useSharedState } from '../../context/state.context'

import styles from './styles'

const useStyles = makeStyles(styles)

const TrasuryBalance = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [state] = useSharedState()
  const { eosRate = 0, currencyBalance = '' } = state.eosTrasuryBalance

  return (
    <div className={classes.eosPriceContainer}>
      <label className={classes.eosPriceTitle}>{t('titleEosBalance')}</label>
      <label className={classes.eosBalance}>
        {formatWithThousandSeparator(currencyBalance.split(' ')[0], 2)} EOS
      </label>
      <label className={classes.eosBalanceInDollars}>
        $
        {formatWithThousandSeparator(
          eosRate * Number(currencyBalance.split(' ')[0]),
          2
        ) || 0}{' '}
        @ ${formatWithThousandSeparator(eosRate, 2)}/EOS
      </label>
    </div>
  )
}

export default memo(TrasuryBalance)
