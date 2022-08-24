import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/system'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

const RenderChartLegend = ({ data }) => {
  return (
    <ul style={{ listStyle: 'none' }}>
      {data.map(({ name, color }) => (
        <li key={`key-${name}`}>
          <Box display="flex">
            <Box width={18} height={18} m={0.5} bgcolor={color} />
            <a href={`https://eosauthority.com/account/${name}?network=eos`}>
              {name}
            </a>
          </Box>
        </li>
      ))}
    </ul>
  )
}
RenderChartLegend.propTypes = {
  data: PropTypes.array
}

const IncomeChart = ({ data, coinType }) => {
  return (
    <>
      <Box display="flex" justifyContent="end"></Box>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          width={1000}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis hide dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          {
            <Legend
              content={<RenderChartLegend data={data} />}
              align="right"
              layout="vertical"
              verticalAlign="middle"
            />
          }
          <Bar legendType="wye" dataKey={coinType} barSize={50} fill="#606060">
            {data.map(({ name, color }) => (
              <Cell key={`cell-${name}`} fill={color} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

IncomeChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string
}

export default memo(IncomeChart)
