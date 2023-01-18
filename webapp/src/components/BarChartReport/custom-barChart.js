import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
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
  ResponsiveContainer
} from 'recharts'

import CustomTooltipBarChart from './custom-tooltip-barChart'
import styles from './styles'

const useStyles = makeStyles(styles)
const legentsList = [
  { color: '#f4d35e', label: 'un' },
  { color: '#ee964b', label: '' },
  { color: '#19647e', label: 'total' }
]

const RenderChartLegend = ({ data }) => {
  const classes = useStyles()
  const { t } = useTranslation('generalForm')

  return (
    <div className={classes.chartLegent}>
      {legentsList.map(({ color, label }) => (
        <a key={`key-${label + data.toLocaleLowerCase()}-link-chart`}>
          <Box className={classes.legentCircle} bgcolor={color} />
          {t(`${label === 'total' ? label : label + data.toLocaleLowerCase()}`)}
        </a>
      ))}
    </div>
  )
}

RenderChartLegend.propTypes = {
  data: PropTypes.string
}

const width = window.innerWidth

const CustomBarChart = ({ typeData, selectedUSD, data, barRef }) => {
  const [category, setCategory] = useState('')
  const [coinType, setCoinType] = useState('EOS')

  useEffect(() => {
    if (typeData === 'income') setCategory('claimed')
    else setCategory('categorized')
  }, [typeData])

  useEffect(() => {
    selectedUSD ? setCoinType('USD') : setCoinType('EOS')
  }, [selectedUSD])

  return (
    <ResponsiveContainer width="100%" height={300} marginTop="16px">
      <ComposedChart height={300} data={data} ref={barRef}>
        <CartesianGrid stroke="#f0f0f0" />
        <XAxis
          tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.5 }}
          dataKey="election"
          scale="auto"
        />
        <YAxis tick={{ fontSize: '10px', stroke: '#000', strokeWidth: 0.1 }} />
        <Tooltip
          wrapperStyle={{
            outline: 'none',
            borderRadius: '4px',
            backgroundColor: '#F9F9F9',
            fontSize: '14px',
            padding: '8px'
          }}
          content={
            <CustomTooltipBarChart coinType={coinType} category={category} />
          }
        />
        <Legend content={<RenderChartLegend data={category} />} />
        {legentsList.map(({ color, label }) => (
          <Bar
            key={`key-${label + category}-bar`}
            dataKey={`${coinType}_${label.toLocaleUpperCase()}${
              label === 'total' ? '' : category.toLocaleUpperCase()
            }`}
            barSize={width > 600 ? 35 : 15}
            fill={color}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

CustomBarChart.propTypes = {
  typeData: PropTypes.string,
  selectedUSD: PropTypes.any,
  data: PropTypes.array,
  barRef: PropTypes.object
}

export default memo(CustomBarChart)
