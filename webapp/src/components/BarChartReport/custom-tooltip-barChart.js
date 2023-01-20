import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { formatWithThousandSeparator } from '../../utils'

const CustomTooltipBarChart = ({ payload, label, coinType, category }) => {
  const { t } = useTranslation('generalForm')
  label = label + ''

  if (!payload) return null

  const arrayLabel = label.split(' ')

  return (
    <>
      <strong>
        {`${t(arrayLabel[0].toLocaleLowerCase())} ${arrayLabel[1]}`}
      </strong>
      <div>{`${t('date')}: ${payload[0]?.payload?.date?.split('T')[0]}`}</div>
      <div>{`${t(`un${category}`)}: ${formatWithThousandSeparator(
        payload[0]?.payload[`${coinType}_UN${category.toLocaleUpperCase()}`],
        4
      )}`}</div>
      <div>{`${t(category)}: ${formatWithThousandSeparator(
        payload[0]?.payload[`${coinType}_${category.toLocaleUpperCase()}`],
        4
      )}`}</div>
      <div>{`${t('total')}: ${formatWithThousandSeparator(
        payload[0]?.payload[`${coinType}_TOTAL`],
        4
      )}`}</div>
    </>
  )
}

CustomTooltipBarChart.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  coinType: PropTypes.string,
  category: PropTypes.string
}

export default memo(CustomTooltipBarChart)
