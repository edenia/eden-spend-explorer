import React, { memo, useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
import {
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  FormGroup
} from '@mui/material'
import TooltipDownload from '@mui/material/Tooltip'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import { useTranslation } from 'react-i18next'
import { useCurrentPng } from 'recharts-to-png'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Brush
} from 'recharts'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

import styles from './styles'

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
  let textBalance = ''

  if (payload !== null)
    textBalance = payload[0]?.payload?.isValued ? 'estimated' : 'balance'

  return (
    <div>
      {payload && (
        <div key={`${payload[0]}-tooltip`}>
          <div>
            {t('date', { ns: 'generalForm' })}:
            {payload[0]?.payload.date.split('T')[0]}
          </div>
          <div>
            {`${t(textBalance, {
              ns: 'incomeRoute'
            })}: ${formatWithThousandSeparator(
              payload[0]?.payload[payload[0]?.dataKey],
              4
            )} ${coinType}`}
          </div>
        </div>
      )}
    </div>
  )
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  label: PropTypes.any,
  coinType: PropTypes.string
}

const LineChartReport = ({
  data,
  historicElections,
  keyTranslation,
  pathTranslation
}) => {
  const classes = useStyles()
  const [getBarPng, { ref: lineRef }] = useCurrentPng()
  const { t } = useTranslation()
  const width = window.innerWidth
  const [selectedUSD, setSelected] = useState(false)
  const [coinType, setCoinType] = useState('EOS')
  const [countData, setCountData] = useState(data.length)
  const [xAxisData, setXAxisData] = useState(width > 600 ? 40 : 80)

  console.log(historicElections)

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const handleBarDownload = useCallback(async () => {
    const png = await getBarPng()

    if (png) {
      FileSaver.saveAs(png, 'line-chart.png')
    }
  }, [getBarPng])

  useEffect(() => {
    if (selectedUSD) {
      setCoinType('USD')
    } else {
      setCoinType('EOS')
    }
  }, [selectedUSD])

  const handleBrushChange = data => {
    const count = data.endIndex - data.startIndex
    setCountData(count + 1)
  }

  useEffect(() => {
    if (countData === 0) return
    setXAxisData(width > 600 ? 40 : 80)
    if (countData > 200) setXAxisData(Math.round(countData * 0.25))
    else setXAxisData(Math.round(countData * 0.1))
  }, [countData])

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <Typography variant="span">
            {t(keyTranslation, { ns: pathTranslation })}
          </Typography>
          <TooltipDownload title={t('download', { ns: 'common' })}>
            <IconButton onClick={handleBarDownload}>
              <DownloadOutlined />
            </IconButton>
          </TooltipDownload>
        </div>
        <div className={classes.filter}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={selectedUSD} onChange={handleChange} />}
              label={t('switchInput', { ns: 'generalForm' })}
              labelPlacement="start"
            />
          </FormGroup>
        </div>
      </div>
      <div className={classes.chartContainer}>
        <ResponsiveContainer width="100%" height={300} marginTop="16px">
          <LineChart height={300} data={data} ref={lineRef}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis
              tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.5 }}
              dataKey="date"
              scale="auto"
              interval={xAxisData}
              allowDataOverflow={false}
            />
            <YAxis
              tick={{ fontSize: '10px', stroke: '#000', strokeWidth: 0.1 }}
              scale="linear"
            />
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
            <Line
              type="monotone"
              dataKey={`${coinType}_BALANCE`}
              stroke="#3866eb"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey={`${coinType}_VALUED`}
              stroke="#3866eb"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              strokeDasharray={5}
            />
            <Brush
              dataKey={'date'}
              width={width > 600 ? width * 0.4 : 100}
              height={20}
              x={width > 600 ? width * 0.2 : 150}
              onChange={handleBrushChange}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

LineChartReport.propTypes = {
  data: PropTypes.array,
  historicElections: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string
}

export default memo(LineChartReport)
