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

const RenderChartLegend = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div className={classes.chartLegent}>
      <a key={`key-claimed-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#19647e" />
        {t('claimed', { ns: 'generalForm' })}
      </a>
      <a key={`key-categorized-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#ee964b" />
        {t('categorized', { ns: 'generalForm' })}
      </a>
      <a key={`key-unclaimed-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#f4d35e" />
        {t('unclaimed', { ns: 'generalForm' })}
      </a>
      <a key={`key-uncategorized-link-chart`}>
        <Box className={classes.legentCircle} bgcolor="#28afb0" />
        {t('uncategorized', { ns: 'generalForm' })}
      </a>
    </div>
  )
}

const CustomTooltip = ({ payload = [], label = '', coinType = '' }) => {
  const { t } = useTranslation()
  label = label + ''
  const arrayLabel = label.split(' ')

  return (
    <div>
      <strong>
        {`${t(arrayLabel[0].toLocaleLowerCase(), { ns: 'generalForm' })}`}
      </strong>
      {payload &&
        payload.map((data, i) => (
          <div key={`${i}-tooltip`}>
            <div>
              {`${
                data.payload.category
                  ? t(
                      (
                        data.dataKey.split('_')[1] + data.payload.category
                      ).toLocaleLowerCase(),
                      {
                        ns: 'generalForm'
                      }
                    )
                  : t(data.dataKey.split('_')[1].toLocaleLowerCase(), {
                      ns: 'generalForm'
                    })
              }: ${formatWithThousandSeparator(
                data.payload[data.dataKey],
                4
              )} ${coinType}`}
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
  label: PropTypes.any,
  coinType: PropTypes.string
}

const StackedBarChartReport = ({
  data,
  keyTranslation,
  pathTranslation,
  showLegend
}) => {
  const classes = useStyles()
  const [getBarPng, { ref: barRef }] = useCurrentPng()
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
    selectedUSD ? setCoinType('USD') : setCoinType('EOS')
  }, [selectedUSD])

  return (
    <div className={classes.chartContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <Typography variant="span">
            {t(keyTranslation, { ns: pathTranslation })}
          </Typography>
          <TooltipDownload title="Download">
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

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          height={400}
          data={data}
          margin={{
            top: 24
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
            content={<CustomTooltip coinType={coinType} />}
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
          <Bar dataKey={`${coinType}_UN`} barSize={88} stackId="a">
            {data.map(({ type }) => (
              <Cell
                key={`cell-${type}`}
                fill={type === 'income' ? '#f4d35e' : '#28afb0'}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

StackedBarChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  showLegend: PropTypes.bool
}

export default memo(StackedBarChartReport)
