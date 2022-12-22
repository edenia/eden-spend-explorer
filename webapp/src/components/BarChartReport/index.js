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

const BarChartReport = ({
  data,
  keyTranslation,
  pathTranslation,
  showLegend,
  typeData
}) => {
  const classes = useStyles()
  const [getBarPng, { ref: barRef }] = useCurrentPng()
  const [category, setCategory] = useState('')
  const { t } = useTranslation()
  const [selectedUSD, setSelected] = useState(false)
  const [coinType, setCoinType] = useState('EOS')

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const handleBarDownload = useCallback(async () => {
    const png = await getBarPng()

    if (png) {
      FileSaver.saveAs(png, 'bar-chart.png')
    }
  }, [getBarPng])

  useEffect(() => {
    if (typeData === 'income') setCategory('Claimed')
    else setCategory('Categorized')
  }, [typeData])

  useEffect(() => {
    selectedUSD ? setCoinType('USD') : setCoinType('EOS')
  }, [selectedUSD])

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
        <ResponsiveContainer
          minWidth={600}
          width="100%"
          height={300}
          marginTop="16px"
        >
          <ComposedChart height={300} data={data} ref={barRef}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis
              tick={{ fontSize: 10, stroke: '#000', strokeWidth: 0.5 }}
              dataKey="election"
              scale="auto"
            />
            <YAxis
              tick={{ fontSize: '10px', stroke: '#000', strokeWidth: 0.1 }}
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
            {showLegend && (
              <Legend content={<RenderChartLegend data={category} />} />
            )}
            <Bar
              dataKey={`${coinType}_UN${category.toLocaleUpperCase()}`}
              barSize={35}
              fill="#f4d35e"
            >
              {data.map(({ election }) => (
                <Cell key={`cell-${election}`} />
              ))}
            </Bar>
            <Bar
              dataKey={`${coinType}_${category.toLocaleUpperCase()}`}
              barSize={35}
              fill="#ee964b"
            >
              {data.map(({ election }) => (
                <Cell key={`cell-${election}`} />
              ))}
            </Bar>
            <Bar dataKey={`${coinType}_TOTAL`} barSize={35} fill="#19647e">
              {data.map(({ election }) => (
                <Cell key={`cell-${election}`} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

BarChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  showLegend: PropTypes.bool,
  typeData: PropTypes.string
}

export default memo(BarChartReport)
