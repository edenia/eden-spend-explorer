import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'

import styles from './styles'

const useStyles = makeStyles(styles)

const thousandSeparator = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    coin
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  console.log({ props })

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${coin}-${thousandSeparator(Number(value))}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const IncomePieChart = ({ data, coinType }) => {
  const newData = data.map(info => {
    return { ...info, coin: coinType }
  })
  console.log({ newData })

  const classes = useStyles()
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  return (
    <>
      <div className={classes.chartContainer}>
        <div id="chart-scroll-id">
          <ResponsiveContainer width="50%" height={300}>
            <PieChart
              height={300}
              width="50%"
              margin={{
                top: 40,
                right: 0,
                bottom: 0,
                left: 12
              }}
            >
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={newData}
                nameKey={'name'}
                dataKey={coinType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#00c2bf"
                onMouseEnter={onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

IncomePieChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string
}

export default memo(IncomePieChart)
