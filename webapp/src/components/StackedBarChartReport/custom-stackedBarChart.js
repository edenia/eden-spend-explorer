import React from 'react'
import { Box } from '@mui/system'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
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

import styles from './styles'
import CustomTooltipStackedBarChart from './custom-tooltip-stackedBarChart'

const useStyles = makeStyles(styles)
const legendsList = [
  { color: '#19647e', label: 'claimed' },
  { color: '#ee964b', label: 'categorized' },
  { color: '#f4d35e', label: 'unclaimed' },
  { color: '#28afb0', label: 'uncategorized' }
]

const RenderChartLegend = () => {
  const classes = useStyles()
  const { t } = useTranslation('generalForm')

  return (
    <div className={classes.chartLegent}>
      {legendsList.map(({ color, label }) => (
        <a key={`key-${label}-link-chart`}>
          <Box className={classes.legentCircle} bgcolor={color} />
          {t(label)}
        </a>
      ))}
    </div>
  )
}

const CustomStackedBarChart = ({ data, barRef, coinType, showLegend }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        height={400}
        data={data}
        margin={{
          top: 24,
          left: -16
        }}
        ref={barRef}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.5 }}
          dataKey="type"
          scale="auto"
        />
        <YAxis tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.1 }} />
        <Tooltip
          wrapperStyle={{
            outline: 'none',
            borderRadius: '4px',
            backgroundColor: '#F9F9F9',
            fontSize: '14px',
            padding: '8px'
          }}
          content={<CustomTooltipStackedBarChart coinType={coinType} />}
        />
        {showLegend && <Legend content={<RenderChartLegend />} />}
        <Bar dataKey={`${coinType}_`} barSize={88} stackId="a">
          {data.map(({ type }) => (
            <Cell
              key={`cell-${type}`}
              fill={type === 'income' ? '#19647e' : '#ee964b'}
            />
          ))}
        </Bar>
        <Bar dataKey={`${coinType}_UN`} barSize={35} stackId="a">
          {data.map(({ type }) => (
            <Cell
              key={`cell-${type}`}
              fill={type === 'income' ? '#f4d35e' : '#28afb0'}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  )
}

CustomStackedBarChart.propTypes = {
  data: PropTypes.array,
  barRef: PropTypes.object,
  coinType: PropTypes.string,
  showLegend: PropTypes.bool
}

export default CustomStackedBarChart
