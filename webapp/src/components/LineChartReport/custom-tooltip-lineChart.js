import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator } from '../../utils'

const CustomTooltipLineChart = ({
  payload = [],
  label = '',
  coinType = ''
}) => {
  const { t } = useTranslation('incomeRoute')
  label = label + ''

  if (!payload) return null

  const textBalance = payload[0]?.payload?.isValued ? 'estimated' : 'balance'
  const dateBalance = `${t('date', { ns: 'generalForm' })}: ${
    payload[0]?.payload.date.split('T')[0]
  }`
  const amountBalance = `${t(textBalance)}: ${formatWithThousandSeparator(
    payload[0]?.payload[payload[0]?.dataKey],
    4
  )} ${coinType}`

  return (
    <>
      <div>{dateBalance}</div>
      <div>{amountBalance}</div>
    </>
  )
}

CustomTooltipLineChart.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  coinType: PropTypes.string
}

export default memo(CustomTooltipLineChart)
