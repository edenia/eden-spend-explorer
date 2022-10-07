import React, { memo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'
import { useCurrentPng } from 'recharts-to-png'
import FileSaver from 'file-saver'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

import styles from './styles'

const useStyles = makeStyles(styles)

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

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        lengthAdjust="spacingAndGlyphs"
      >
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
        lengthAdjust="spacingAndGlyphs"
      >{`${coin}-${formatWithThousandSeparator(value, 2)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        lengthAdjust="spacingAndGlyphs"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const IncomePieChart = ({ data, coinType }) => {
  const classes = useStyles()

  const [activeIndex, setActiveIndex] = useState(0)

  const newData = data.map(info => {
    return { ...info, coin: coinType }
  })

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const [getPiePng, { ref: pieRef }] = useCurrentPng()

  const handlePieDownload = useCallback(async () => {
    const png = await getPiePng()

    if (png) {
      FileSaver.saveAs(png, 'pie-chart.png')
    }
  }, [getPiePng])

  return (
    <>
      <div className={classes.chartSubcontainer}>
        <ResponsiveContainer height={300}>
          <PieChart width={500} height={300} ref={pieRef}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={newData}
              nameKey={'name'}
              dataKey={coinType}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              fill="#00c2bf"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
        <button onClick={handlePieDownload}>
          <code>Download Pie Chart</code>
        </button>
      </div>
    </>
  )
}

IncomePieChart.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string
}

export default memo(IncomePieChart)
