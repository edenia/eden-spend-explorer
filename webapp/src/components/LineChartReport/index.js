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

const renderTraveller = props => {
  const { x, y, width, height } = props

  return (
    <path
      d={`M ${x}, ${y + height}
        m -${width * 5}, 0
        a ${width * 5},${width * 5} 0 1,0 ${width * 10},0
        a ${width * 5},${width * 5} 0 1,0 ${-width * 10},0`}
      fill={'#3866eb'}
      stroke={'#3866eb'}
    />
  )
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
  const [viewSelected, setViewSelect] = useState('')
  const [dataChart, setDataChart] = useState(data)

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

  useEffect(() => {
    if (data === []) return

    setDataChart(data)

    if (data.length > 0) setViewSelect('all')
  }, [data])

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

  const handleSelectElection = e => {
    setViewSelect(e.target.value)
  }

  useEffect(() => {
    if (viewSelected === 'last') {
      const date = historicElections?.at(-1)?.date_election.split('T')[0]
      const subData = data?.filter(obj => obj.date >= date)
      setDataChart(subData)
      setCountData(subData.length)
    } else if (viewSelected === 'last-three') {
      const count = historicElections.length - 3 || 0
      const date = historicElections?.at(count)?.date_election.split('T')[0]
      const subData = data?.filter(obj => obj.date >= date)
      setDataChart(subData)
      setCountData(subData.length)
    } else {
      setDataChart(data)
      setCountData(data.length)
    }
  }, [viewSelected])

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
          <button onClick={handleSelectElection} value="all">
            all
          </button>
          <button onClick={handleSelectElection} value="last-three">
            last three election
          </button>
          <button onClick={handleSelectElection} value="last">
            last election
          </button>
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
          <LineChart height={300} data={dataChart} ref={lineRef}>
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
              x={width > 600 ? width * 0.2 : 150}
              stroke={'#C2E0FF'}
              traveller={renderTraveller}
              travellerWidth={1}
              onChange={handleBrushChange}
            >
              <LineChart data={dataChart}>
                <Line
                  type="monotone"
                  dataKey={`${coinType}_BALANCE`}
                  stroke="#3866eb"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={`${coinType}_VALUED`}
                  stroke="#3866eb"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray={5}
                />
              </LineChart>
            </Brush>
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
