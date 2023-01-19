import React, { memo } from 'react'
import PropTypes from 'prop-types'
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

import CustomTooltipLineChart from './custom-tooltip-lineChart'

const width = window.innerWidth

const CustomLineChart = ({ coinType, data, lineRef }) => {
  return (
    <ResponsiveContainer width="100%" height={300} marginTop="16px">
      <LineChart
        margin={{ left: -16, top: 8 }}
        height={300}
        data={data}
        ref={lineRef}
      >
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
          content={<CustomTooltipLineChart coinType={coinType} />}
        />
        <Line
          type="monotone"
          dataKey={`${coinType}_BALANCE`}
          stroke="#3866eb"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey={`${coinType}_VALUED`}
          stroke="#3866eb"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          strokeDasharray={5}
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
  coinType: PropTypes.string,
  data: PropTypes.array,
  lineRef: PropTypes.object
}

export default memo(CustomLineChart)
