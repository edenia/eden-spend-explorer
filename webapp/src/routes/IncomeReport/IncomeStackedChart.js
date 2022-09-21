import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
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

import styles from './styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(styles)

const RenderChartLegend = ({ data }) => {
  const classes = useStyles()
  return (
    <div className={classes.chartLinks}>
      {data.map(({ name, color, link = true }) => (
        <a
          className={link ? classes.disableLink : ''}
          key={`key-${name}`}
          href={`https://eosauthority.com/account/${name}?network=eos`}
        >
          <Box
            width={18}
            height={18}
            ml={2}
            mt={0.5}
            mr={0.5}
            bgcolor={color}
          />
          {name}
        </a>
      ))}
    </div>
  )
}
RenderChartLegend.propTypes = {
  data: PropTypes.array
}

const CustomTooltip = ({ payload = [], label = '', thousandSeparator }) => {
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
          } : ${thousandSeparator(data.payload[data.dataKey])}`}</div>
        ))}
    </div>
  )
}
CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  thousandSeparator: PropTypes.func
}

const IncomeStakedChart = ({
  data,
  coinType,
  showEosRate,
  thousandSeparator
}) => {
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
                content={
                  <CustomTooltip thousandSeparator={thousandSeparator} />
                }
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
  showEosRate: PropTypes.bool,
  thousandSeparator: PropTypes.func
}

export default memo(IncomeStakedChart)
