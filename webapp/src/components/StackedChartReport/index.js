import React, { memo, useCallback } from 'react'
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
  Line,
  ResponsiveContainer
} from 'recharts'
import { useCurrentPng } from 'recharts-to-png'
import FileSaver from 'file-saver'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

import styles from './styles'
import { Box } from '@mui/system'

const useStyles = makeStyles(styles)

const CustomTooltip = ({ payload = [], label = '', typeCurrency = '' }) => {
  const { t } = useTranslation('generalForm')

  return (
    <div>
      <strong>{label}</strong>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>{`${
            data.dataKey === 'EXCHANGE_RATE'
              ? t('exchangeRate')
              : data.dataKey === `${typeCurrency}_CLAIMED`
              ? `${t('claimedCat')} `
              : data.dataKey === `${typeCurrency}_UNCLAIMED`
              ? `${t('unclaimedCat')} `
              : data.dataKey === `${typeCurrency}_CATEGORIZED`
              ? `${t('categorizedCat')} `
              : data.dataKey === `${typeCurrency}_UNCATEGORIZED` &&
                t('uncategorizedCat')
          }: ${formatWithThousandSeparator(
            data.payload[data.dataKey],
            4
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
  const { t } = useTranslation('generalForm')

  const classes = useStyles()

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

          {data.dataKey === 'EXCHANGE_RATE'
            ? t('exchangeRate')
            : data.dataKey === `${typeCurrency}_CLAIMED`
            ? `${t('claimedCat')} `
            : data.dataKey === `${typeCurrency}_UNCLAIMED`
            ? `${t('unclaimedCat')} `
            : data.dataKey === `${typeCurrency}_CATEGORIZED`
            ? `${t('categorizedCat')} `
            : data.dataKey === `${typeCurrency}_UNCATEGORIZED` &&
              t('uncategorizedCat')}
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
