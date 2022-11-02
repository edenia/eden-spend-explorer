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

const lowerCaseAllWordsExceptFirstLetters = string =>
  string.replaceAll(
    /\S*/g,
    word => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
  )

const RenderChartLegend = ({ data }) => {
  const classes = useStyles()

  return (
    <div className={classes.chartLinks}>
      <a key={`key-Un${data.toLocaleLowerCase()}-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#f4d35e"
          borderRadius={5}
        />
        {`Un${data.toLocaleLowerCase()}`}
      </a>
      <a key={`key-total-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#19647e"
          borderRadius={5}
        />
        {`Total`}
      </a>
      <a key={`key-${data}-link-chart`}>
        <Box
          width={12}
          height={12}
          ml={2}
          mt={0.5}
          mr={0.5}
          bgcolor="#ee964b"
          borderRadius={5}
        />
        {data}
      </a>
    </div>
  )
}

RenderChartLegend.propTypes = {
  data: PropTypes.string
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
              {`${lowerCaseAllWordsExceptFirstLetters(
                data.dataKey.split('_')[1]
              )}: ${formatWithThousandSeparator(
                data.payload[data.dataKey],
                4
              )}`}
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

const BarChartGeneralReport = ({
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
    typeData === 'income' ? setCategory('Claimed') : setCategory('Categorized')
  }, [typeData])

  useEffect(() => {
    selectedUSD ? setCoinType('USD') : setCoinType('EOS')
  }, [selectedUSD])

  return (
    <>
      <div className={classes.chartContainer}>
        <div className={classes.textContainer}>
          <Typography variant="h4">
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
          <ResponsiveContainer width="100%" height={400}>
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
              <XAxis tick={{ fontSize: 10 }} dataKey="election" scale="auto" />
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
                content={<CustomTooltip />}
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
              <Bar dataKey={`${coinType}_TOTAL`} barSize={35} fill="#19647e">
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
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

BarChartGeneralReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  showLegend: PropTypes.bool,
  typeData: PropTypes.string
}

export default memo(BarChartGeneralReport)
