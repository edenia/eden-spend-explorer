import React, { memo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts'
import { useCurrentPng } from 'recharts-to-png'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { IconButton, Typography } from '@mui/material'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import TooltipDownload from '@mui/material/Tooltip'

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
        textLength="10%"
        textAnchor="middle"
        fill={payload.color}
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
        fill={payload.color}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.color}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={payload.color}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
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
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  )
}

const PieChartReport = ({
  data,
  coinType,
  keyTranslation,
  pathTranslation
}) => {
  const classes = useStyles()
  const [activeIndex, setActiveIndex] = useState(0)
  const [getPiePng, { ref: pieRef }] = useCurrentPng()
  const { t } = useTranslation()

  const newData = data.map(info => {
    return { ...info, coin: coinType }
  })

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handlePieDownload = useCallback(async () => {
    const png = await getPiePng()

    if (png) {
      FileSaver.saveAs(png, 'pie-chart.png')
    }
  }, [getPiePng])

  return (
    <>
      <div className={classes.chartContainer}>
        <div className={classes.textContainer}>
          <Typography variant="h4">
            {t(keyTranslation, { ns: pathTranslation })}
          </Typography>
          <TooltipDownload title="Donwload">
            <IconButton onClick={handlePieDownload}>
              <DownloadOutlined />
            </IconButton>
          </TooltipDownload>
        </div>
        <ResponsiveContainer height={400}>
          <PieChart height={250} ref={pieRef}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={newData}
              nameKey={'name'}
              dataKey={`${coinType}_CLAIMED`}
              cx="50%"
              cy="50%"
              innerRadius={'40%'}
              outerRadius={'70%'}
              onMouseEnter={onPieEnter}
            >
              {data.map(data => (
                <Cell key={`cell-${data.election}`} fill={data.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

PieChartReport.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string
}

export default memo(PieChartReport)
