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
  ResponsiveContainer,
  Cell
} from 'recharts'

import styles from './styles'
import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

const useStyles = makeStyles(styles)

const RenderChartLegend = ({ data }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div className={classes.chartLegent}>
      <a key={`key-Un${data.toLocaleLowerCase()}-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#f4d35e" />
        {t(`un${data.toLocaleLowerCase()}`, { ns: 'generalForm' })}
      </a>
      <a key={`key-${data}-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#ee964b" />
        {t(`${data.toLocaleLowerCase()}`, { ns: 'generalForm' })}
      </a>
      <a key={`key-total-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#19647e" />
        {t('total', { ns: 'generalForm' })}
      </a>
    </div>
  )
}

RenderChartLegend.propTypes = {
  data: PropTypes.string
}

const CustomTooltip = ({ payload = [], label = '', coinType = '' }) => {
  const { t } = useTranslation()
  label = label + ''
  const arrayLabel = label.split(' ')

  return (
    <div>
      <strong>
        {`${t(arrayLabel[0].toLocaleLowerCase(), { ns: 'generalForm' })} ${
          arrayLabel[1]
        }`}
      </strong>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>
            <div>
              {i === 0 &&
                data.payload?.date &&
                `${
                  data.payload.date ? t('date', { ns: 'generalForm' }) : ''
                }: ${
                  data.payload.date ? data.payload.date.split('T')[0] : ''
                } `}
            </div>
            <div>
              {`${t(
                data.payload.category
                  ? `${data.dataKey
                      .split('_')[1]
                      .toLocaleLowerCase()}${data.payload.category.toLocaleLowerCase()}`
                  : data.dataKey.split('_')[1].toLocaleLowerCase(),
                { ns: 'generalForm' }
              )}: ${formatWithThousandSeparator(
                data.payload[data.dataKey],
                4
              )} ${coinType}`}
            </div>
          </div>
        ))}
    </div>
  )
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  coinType: PropTypes.string
}

const width = window.innerWidth

const CustomBarChart = ({
  typeData,
  selectedUSD,
  data,
  barRef,
  showLegend
}) => {
  const [category, setCategory] = useState('')
  const [coinType, setCoinType] = useState('EOS')

  useEffect(() => {
    if (typeData === 'income') setCategory('Claimed')
    else setCategory('Categorized')
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
          content={<CustomTooltip coinType={coinType} />}
        />
        {showLegend && (
          <Legend content={<RenderChartLegend data={category} />} />
        )}
        <Bar
          dataKey={`${coinType}_UN${category.toLocaleUpperCase()}`}
          barSize={width > 600 ? 35 : 15}
          fill="#f4d35e"
        >
          {data.map(({ election }) => (
            <Cell key={`cell-${election}`} />
          ))}
        </Bar>
        <Bar
          dataKey={`${coinType}_${category.toLocaleUpperCase()}`}
          barSize={width > 600 ? 35 : 15}
          fill="#ee964b"
        >
          {data.map(({ election }) => (
            <Cell key={`cell-${election}`} />
          ))}
        </Bar>
        <Bar
          dataKey={`${coinType}_TOTAL`}
          barSize={width > 600 ? 35 : 15}
          fill="#19647e"
        >
          {data.map(({ election }) => (
            <Cell key={`cell-${election}`} />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  )
}

CustomBarChart.propTypes = {
  typeData: PropTypes.string,
  selectedUSD: PropTypes.any,
  data: PropTypes.array,
  barRef: PropTypes.object,
  showLegend: PropTypes.bool
}

export default memo(CustomBarChart)
