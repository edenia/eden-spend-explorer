import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Brush
} from 'recharts'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

const width = window.innerWidth

const CustomTooltip = ({ payload = [], label = '', coinType = '' }) => {
  const { t } = useTranslation()
  label = label + ''

  return (
    <div>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>
            <div>
              {i === 0 &&
                `${t('date', { ns: 'generalForm' })}: ${
                  data.payload.date.split('T')[0]
                } `}
            </div>
            <div>
              {`${t('balance', {
                ns: 'incomeRoute'
              })}: ${formatWithThousandSeparator(
                data.payload[data.dataKey],
                4
              )} ${coinType}`}
            </div>
          </div>
        ))}
    </div>
  )
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  coinType: PropTypes.string
}

const CustomLineChart = ({ selectedUSD, data, lineRef }) => {
  const [coinType, setCoinType] = useState('EOS')
  const [dataKey, setDataKey] = useState('balance')

  useEffect(() => {
    if (selectedUSD) {
      setCoinType('USD')
      setDataKey('usd_total')
    } else {
      setDataKey('balance')
      setCoinType('EOS')
    }
  }, [selectedUSD])

  return (
    <ResponsiveContainer width="100%" height={300} marginTop="16px">
      <LineChart margin={{ left: -16 }} height={300} data={data} ref={lineRef}>
        <CartesianGrid stroke="#f0f0f0" />
        <XAxis
          tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.5 }}
          dataKey="date"
          scale="auto"
          interval={width > 600 ? 40 : 80}
          allowDataOverflow={false}
        />
        <YAxis
          tick={{ fontSize: '10px', stroke: '#000', strokeWidth: 0.1 }}
          scale="linear"
        />
        <Tooltip
          wrapperStyle={{
            outline: 'none',
            borderRadius: '4px',
            backgroundColor: '#F9F9F9',
            fontSize: '14px',
            padding: '8px'
          }}
          content={<CustomTooltip coinType={coinType} />}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#3866eb"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Brush
          dataKey={'date'}
          width={width > 600 ? width * 0.4 : 100}
          height={20}
          x={width > 600 ? width * 0.2 : 150}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

CustomLineChart.propTypes = {
  selectedUSD: PropTypes.bool,
  data: PropTypes.array,
  lineRef: PropTypes.object
}

export default memo(CustomLineChart)
