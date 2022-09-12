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

const useStyles = makeStyles(styles)

const RenderChartLegend = ({ data }) => {
  const classes = useStyles()
  return (
    <div className={classes.chartLinks}>
      {data.map(({ name, color }) => (
        <a
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

const IncomeChart = ({ data, coinType }) => {
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
              <XAxis hide dataKey="name" scale="auto" />
              <YAxis tick={{ stroke: '#606060', strokeWidth: 0.5 }} />
              <YAxis
                dataKey="EOS_EXCHANGE"
                scale="auto"
                yAxisId="right"
                orientation="right"
                tick={{ stroke: '#00c2bf', strokeWidth: 0.5 }}
              />
              <Tooltip />
              <Legend
                content={<RenderChartLegend data={data} />}
                align="right"
                layout="vertical"
                verticalAlign="middle"
              />
              <Bar
                legendType="wye"
                dataKey={coinType}
                barSize={25}
                fill="#606060"
              >
                {data.map(({ name, color }) => (
                  <Cell key={`cell-${name}`} fill={color} />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="EOS_EXCHANGE"
                stroke="#00c2bf"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

IncomeChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string
}

export default memo(IncomeChart)
