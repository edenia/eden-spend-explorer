import React, { memo, useEffect, useRef, useState } from 'react'
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

const renderTraveller = props => {
  const { x, y, width } = props

  return (
    <path
      d={`M ${x}, ${y + 15}
        m -${width * 5}, 0
        a ${width * 5},${width * 5} 0 1,0 ${width * 10},0
        a ${width * 5},${width * 5} 0 1,0 ${-width * 10},0`}
      fill={'#3866eb'}
      stroke={'#3866eb'}
    />
  )
}

const CustomLineChart = ({ coinType, data, lineRef }) => {
  const widthRef = useRef(null)
  const [width, setWidth] = useState(window.innerWidth)
  const [countData, setCountData] = useState(data.length)
  const [xAxisData, setXAxisData] = useState(width > 600 ? 40 : 80)

  const handleBrushChange = data => {
    const count = data.endIndex - data.startIndex
    setCountData(count + 1)
  }

  useEffect(() => {
    setCountData(data.length)
  }, [data])

  useEffect(() => {
    if (countData === 0) return
    if (countData > 200) setXAxisData(Math.round(countData * 0.25))
    if (width > 600) {
      if (countData < 200) setXAxisData(Math.round(countData * 0.1))
    } else {
      if (countData < 200) setXAxisData(Math.round(countData * 0.25))
    }
  }, [countData, width])

  useEffect(() => {
    setWidth(widthRef.current.current.clientWidth)
    const handleResize = () => {
      setWidth(widthRef.current.current.clientWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <ResponsiveContainer
      ref={widthRef}
      width="100%"
      height={300}
      marginTop="16px"
    >
      <LineChart
        margin={{ top: 8, bottom: 24, right: 16 }}
        height={300}
        data={data}
        ref={lineRef}
      >
        <CartesianGrid stroke="#f0f0f0" />
        <XAxis
          tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.5 }}
          dataKey="date"
          scale="auto"
          interval={xAxisData}
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
          width={width * 0.7}
          height={30}
          x={width / 6.2}
          y={260}
          traveller={renderTraveller}
          travellerWidth={1}
          onChange={handleBrushChange}
        >
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey={`${coinType}_BALANCE`}
              stroke="#87cefa"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={`${coinType}_VALUED`}
              stroke="#87cefa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </Brush>
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
