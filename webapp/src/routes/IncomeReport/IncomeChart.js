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
  Cell,
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

const CustomTooltip = ({
  active,
  payload = [],
  label = '',
  thousandSeparator
}) => {
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
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.any,
  thousandSeparator: PropTypes.func
}

const IncomeChart = ({ data, coinType, showEosRate, thousandSeparator }) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.chartContainer}>
        <div id="chart-scroll-id">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 0,
                bottom: 20,
                left: 12
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis tick={{ fontSize: 10 }} dataKey="name" scale="auto" />
              <YAxis
                tick={{ fontSize: 14, stroke: '#00c2bf', strokeWidth: 0.5 }}
              />
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
              <Legend content={<RenderChartLegend data={data} />} />
              <Bar dataKey={coinType} barSize={25} fill="#606060">
                {data.map(({ name, color }) => (
                  <Cell key={`cell-${name}`} fill={color} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

IncomeChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string,
  showEosRate: PropTypes.bool,
  thousandSeparator: PropTypes.func
}

export default memo(IncomeChart)
