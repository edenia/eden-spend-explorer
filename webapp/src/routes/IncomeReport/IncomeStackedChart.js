import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line
} from 'recharts'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

import styles from './styles'

const useStyles = makeStyles(styles)

const CustomTooltip = ({ payload = [], label = '' }) => {
  const { t } = useTranslation('incomeRoute')
  return (
    <div>
      <strong>{label}</strong>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>{`${
            data.dataKey === 'EOS_EXCHANGE'
              ? t('chartExchangeRateEos')
              : data.dataKey
          } : ${formatWithThousandSeparator(
            data.payload[data.dataKey],
            2
          )}`}</div>
        ))}
    </div>
  )
}
CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any
}

const IncomeStakedChart = ({ data, coinType, showEosRate }) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.chartContainer}>
        <div id="chart-scroll-id">
          <ResponsiveContainer width="50%" height={300}>
            <ComposedChart
              height={300}
              data={data}
              margin={{
                top: 40,
                right: 0,
                bottom: 0,
                left: 12
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis hide dataKey="name" scale="auto" />
              <YAxis tick={{ stroke: '#606060', strokeWidth: 0.5 }} />
              {showEosRate && (
                <>
                  <YAxis
                    dataKey="EXCHANGE_RATE"
                    scale="auto"
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 14, stroke: '#00c2bf', strokeWidth: 0.5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="EXCHANGE_RATE"
                    stroke="#00c2bf"
                    strokeWidth={2}
                  />
                </>
              )}
              <Tooltip
                wrapperStyle={{
                  outline: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#bfefef',
                  fontSize: '14px',
                  padding: '8px'
                }}
                content={<CustomTooltip />}
              />
              <Legend />
              <Bar
                legendType="wye"
                stackId="a"
                dataKey={`${coinType}_CLAIMED`}
                barSize={25}
                fill="#82ca9d"
              />
              <Bar
                legendType="wye"
                stackId="a"
                dataKey={`${coinType}_UNCLAIMED`}
                barSize={25}
                fill="#8884d8"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

IncomeStakedChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string,
  showEosRate: PropTypes.bool
}

export default memo(IncomeStakedChart)
