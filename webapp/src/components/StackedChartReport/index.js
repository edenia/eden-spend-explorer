import React, { memo, useCallback } from 'react'
import FileSaver from 'file-saver'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useCurrentPng } from 'recharts-to-png'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer
} from 'recharts'

import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'

const useStyles = makeStyles(styles)

const CustomTooltip = ({ payload = [], label = '', typeCurrency = '' }) => {
  const { t } = useTranslation()

  const selectDataKey = dataKey => {
    if (dataKey === 'EXCHANGE_RATE') return t('exchangeRate')
    else if (dataKey === `${typeCurrency}_CLAIMED`)
      return t('claimedCat', { ns: 'generalForm' })
    else if (dataKey === `${typeCurrency}_UNCLAIMED`)
      return t('unclaimedCat', { ns: 'generalForm' })
    else if (dataKey === `${typeCurrency}_CATEGORIZED`)
      return t('categorizedCat', { ns: 'generalForm' })
    else if (dataKey === `${typeCurrency}_UNCATEGORIZED`)
      return t('uncategorizedCat', { ns: 'generalForm' })
  }

  return (
    <div>
      <strong>{label}</strong>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>{`${selectDataKey(
            data.dataKey
          )}: ${formatWithThousandSeparator(
            data.payload[data.dataKey],
            2
          )}`}</div>
        ))}
    </div>
  )
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  typeCurrency: PropTypes.any
}

const RenderLegend = ({ payload, typeCurrency }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const selectDataKey = dataKey => {
    if (dataKey === 'EXCHANGE_RATE') return t('exchangeRate')
    else if (dataKey === `${typeCurrency}_CLAIMED`)
      return t('claimedCat', { ns: 'generalForm' })
    else if (dataKey === `${typeCurrency}_UNCLAIMED`)
      return t('unclaimedCat', { ns: 'generalForm' })
    else if (dataKey === `${typeCurrency}_CATEGORIZED`)
      return t('categorizedCat', { ns: 'generalForm' })
    else if (dataKey === `${typeCurrency}_UNCATEGORIZED`)
      return t('uncategorizedCat', { ns: 'generalForm' })
  }

  return (
    <div className={classes.legendContainer}>
      {payload.map((data, index) => (
        <label className={classes.labelContainer} key={`item-${index}`}>
          <Box
            width={18}
            height={18}
            ml={2}
            mt={0.5}
            mr={0.5}
            bgcolor={data.color}
          />

          {selectDataKey(data.dataKey)}
        </label>
      ))}
    </div>
  )
}

RenderLegend.propTypes = {
  payload: PropTypes.array,
  typeCurrency: PropTypes.string
}

const StakedChartReport = ({
  data,
  firstCategory,
  secondCategory,
  typeCurrency,
  showEosRate
}) => {
  const classes = useStyles()
  const [getStakedPng, { ref: stackedRef }] = useCurrentPng()

  const handleStakedDownload = useCallback(async () => {
    const png = await getStakedPng()

    if (png) {
      FileSaver.saveAs(png, 'staked-chart.png')
    }
  }, [getStakedPng])

  return (
    <>
      <div className={classes.chartContainer}>
        <ResponsiveContainer height={300}>
          <ComposedChart width={500} height={300} data={data} ref={stackedRef}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis hide dataKey="name" scale="auto" />
            <YAxis tick={{ stroke: '#606060', strokeWidth: 0.5 }} />
            {showEosRate && (
              <>
                <YAxis
                  dataKey="EXCHANGE_RATE"
                  scale="auto"
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 14, stroke: '#00c2bf', strokeWidth: 0.5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="EXCHANGE_RATE"
                  stroke="#00c2bf"
                  strokeWidth={2}
                />
              </>
            )}
            <Tooltip
              wrapperStyle={{
                outline: 'none',
                borderRadius: '4px',
                backgroundColor: '#bfefef',
                fontSize: '14px',
                padding: '8px'
              }}
              content={<CustomTooltip typeCurrency={typeCurrency} />}
            />
            <Legend content={<RenderLegend typeCurrency={typeCurrency} />} />
            <Bar
              legendType="wye"
              stackId="a"
              dataKey={`${typeCurrency}_${firstCategory}`}
              barSize={25}
              fill="#82ca9d"
            />
            <Bar
              legendType="wye"
              stackId="a"
              dataKey={`${typeCurrency}_${secondCategory}`}
              barSize={25}
              fill="#8884d8"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <button onClick={handleStakedDownload}>
          <code>Download Staked Bar Chart</code>
        </button>
      </div>
    </>
  )
}

StakedChartReport.propTypes = {
  data: PropTypes.array,
  firstCategory: PropTypes.string,
  secondCategory: PropTypes.string,
  typeCurrency: PropTypes.string,
  showEosRate: PropTypes.bool
}

export default memo(StakedChartReport)
