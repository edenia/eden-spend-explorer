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
    <div className={classes.chartLinks}>
      <a key={`key-claimed-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#19647e"
          borderRadius={5}
        />
        {t('claimed', { ns: 'generalForm' })}
      </a>
      <a key={`key-categorized-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#ee964b"
          borderRadius={5}
        />
        {t('categorized', { ns: 'generalForm' })}
      </a>
      <a key={`key-unclaimed-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#f4d35e"
          borderRadius={5}
        />
        {t('unclaimed', { ns: 'generalForm' })}
      </a>
      <a key={`key-uncategorized-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#28afb0"
          borderRadius={5}
        />
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
    <>
      <div className={classes.chartContainer}>
        <div className={classes.textContainer}>
          <Typography variant="h6">
            {t(keyTranslation, { ns: pathTranslation })}
          </Typography>
          <TooltipDownload title="Download">
            <IconButton onClick={handleBarDownload}>
              <DownloadOutlined />
            </IconButton>
          </TooltipDownload>
          <div className={classes.filtersChartContainer}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={selectedUSD} onChange={handleChange} />
                }
                label="Convert to USD"
                labelPlacement="start"
              />
            </FormGroup>
          </div>
        </div>
        <div id="chart-scroll-id">
          <ResponsiveContainer width="50%" height={400}>
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
              <XAxis tick={{ fontSize: 10 }} dataKey="type" scale="auto" />
              <YAxis
                tick={{ fontSize: 14, stroke: '#000000', strokeWidth: 0.5 }}
              />
              <Tooltip
                wrapperStyle={{
                  outline: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#bfefef',
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
      </div>
    </>
  )
}

StackedBarChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  showLegend: PropTypes.bool
}

export default memo(StackedBarChartReport)
