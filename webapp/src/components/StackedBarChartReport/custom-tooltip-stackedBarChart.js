import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator } from '../../utils'

const CustomTooltipStakedBarChart = ({ payload, label, coinType }) => {
  const { t } = useTranslation('generalForm')
  label = label + ''
  const arrayLabel = label.split(' ')

  if (!payload) return null

  return (
    <>
      <strong>{t(arrayLabel[0].toLocaleLowerCase())}</strong>
      <div>{`${t(
        payload[0]?.payload.category.toLocaleLowerCase()
      )}: ${formatWithThousandSeparator(
        payload[0]?.payload[`${coinType}_`],
        4
      )} ${coinType}`}</div>
      <div>{`${t(
        `un${payload[0]?.payload.category.toLocaleLowerCase()}`
      )}: ${formatWithThousandSeparator(
        payload[0]?.payload[`${coinType}_UN`],
        4
      )} ${coinType}`}</div>
    </>
  )
}

CustomTooltipStakedBarChart.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  coinType: PropTypes.string
}

export default memo(CustomTooltipStakedBarChart)
