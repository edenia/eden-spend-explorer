import React, { useEffect, useState, memo } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

const capitalizeFirstLetter = string => {
  const newString = string.replace(/\s/g, '')
  return newString.charAt(0).toUpperCase() + newString.slice(1)
}

const renderActiveShape = props => {
  const {
    cx,
    cy,
    startAngle,
    endAngle,
    payload,
    percent,
    value,
    coin,
    innerRadius,
    outerRadius
  } = props

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-8}
        textAnchor="middle"
        fontSize="12px"
        fontWeight={800}
      >
        {payload.name
          ? capitalizeFirstLetter(payload.name)
          : capitalizeFirstLetter(payload.category)}
      </text>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fontSize="12px"
        fontWeight={500}
      >
        {formatWithThousandSeparator(value, 2)} {coin}
      </text>
      <text
        x={cx}
        y={cy}
        dy={24}
        textAnchor="middle"
        fontSize="12px"
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color}
      />
    </g>
  )
}

const CustomPieChart = ({
  data,
  coinType,
  typeData,
  pieRef,
  innerRadius,
  outerRadius
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [category, setCategory] = useState('')

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const newData = data.map(info => {
    return { ...info, coin: coinType }
  })

  useEffect(() => {
    if (typeData === 'income') {
      setCategory('CLAIMED')
    } else {
      setCategory('CATEGORIZED')
    }
  }, [typeData])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart ref={pieRef}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={newData}
          nameKey={typeData === 'delegate' ? 'category' : 'name'}
          dataKey={
            typeData === 'delegate'
              ? `${coinType}`
              : `${coinType}_${category.toLocaleUpperCase()}`
          }
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          onMouseEnter={onPieEnter}
        >
          {data.map(data => (
            <Cell key={`cell-${data.election}`} fill={data.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

CustomPieChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string,
  typeData: PropTypes.string,
  pieRef: PropTypes.object,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number
}

CustomPieChart.defaultProps = {
  innerRadius: 60,
  outerRadius: 150
}

export default memo(CustomPieChart)
