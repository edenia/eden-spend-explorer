import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
import { IconButton, Typography } from '@mui/material'
import TooltipDownload from '@mui/material/Tooltip'
import DownloadIcon from '@mui/icons-material/Download'
import { useTranslation } from 'react-i18next'
import { useCurrentPng } from 'recharts-to-png'
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

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

import styles from './styles'

const useStyles = makeStyles(styles)

const RenderChartLegend = ({ data }) => {
  const classes = useStyles()

  return (
    <div className={classes.chartLinks}>
      {data.map(({ name, color, link = true, category, date }, index) => (
        <a
          className={link ? classes.disableLink : ''}
          key={`key-${name}-${index}-link-chart`}
          href={`https://eosauthority.com/account/${name}?network=eos`}
        >
          <Box
            width={18}
            height={18}
            ml={2}
            mt={0.5}
            mr={0.5}
            bgcolor={color}
          />
          {category ? date : name}
        </a>
      ))}
    </div>
  )
}

RenderChartLegend.propTypes = {
  data: PropTypes.array
}

const CustomTooltip = ({ payload = [], label = '' }) => {
  const { t } = useTranslation()

  return (
    <div>
      <strong>{label}</strong>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>
            <div>
              {`${
                data.dataKey === 'EXCHANGE_RATE'
                  ? t('exchangeRate', { ns: 'generalForm' })
                  : data.dataKey
              }: ${formatWithThousandSeparator(data.payload[data.dataKey], 3)}`}
            </div>
            <div>
              {i === 0 &&
                data.payload?.date &&
                `${
                  data.payload.date ? t('date', { ns: 'generalForm' }) : ''
                }: ${
                  data.payload.date ? data.payload.date.split('T')[0] : ''
                } `}
            </div>
          </div>
        ))}
    </div>
  )
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any
}

const LineAreaChartReport = ({
  data,
  coinType,
  keyTranslation,
  pathTranslation,
  showLegend
}) => {
  const classes = useStyles()
  const [getBarPng, { ref: barRef }] = useCurrentPng()
  const { t } = useTranslation()

  const handleBarDownload = useCallback(async () => {
    const png = await getBarPng()

    if (png) {
      FileSaver.saveAs(png, 'bar-chart.png')
    }
  }, [getBarPng])

  return (
    <>
      <div className={classes.chartContainer}>
        <div className={classes.textContainer}>
          <Typography variant="h4">
            {t(keyTranslation, { ns: pathTranslation })}
          </Typography>
          <TooltipDownload title="Download">
            <IconButton onClick={handleBarDownload}>
              <DownloadIcon />
            </IconButton>
          </TooltipDownload>
        </div>
        <div id="chart-scroll-id">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 0,
                bottom: 20,
                left: 12
              }}
              ref={barRef}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis tick={{ fontSize: 10 }} dataKey="name" scale="auto" />
              <YAxis
                tick={{ fontSize: 14, stroke: '#00c2bf', strokeWidth: 0.5 }}
              />

              <Tooltip
                wrapperStyle={{
                  outline: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#bfefef',
                  fontSize: '14px',
                  padding: '8px'
                }}
                content={<CustomTooltip />}
              />
              {showLegend && (
                <Legend content={<RenderChartLegend data={data} />} />
              )}
              <Bar dataKey={coinType} barSize={25} fill="#606060">
                {data.map(({ name, color }) => (
                  <Cell key={`cell-${name}`} fill={color} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

LineAreaChartReport.propTypes = {
  data: PropTypes.array,
  coinType: PropTypes.string,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  showLegend: PropTypes.bool
}

export default memo(LineAreaChartReport)
