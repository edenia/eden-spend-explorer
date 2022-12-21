import React, { memo, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts'
import { useCurrentPng } from 'recharts-to-png'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import {
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  FormGroup,
  Divider
} from '@mui/material'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import TooltipDownload from '@mui/material/Tooltip'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'

import styles from './styles'

const useStyles = makeStyles(styles)

const capitalizeFirstLetter = string => {
  const newString = string.replace(/\s/g, '')
  return newString.charAt(0).toUpperCase() + newString.slice(1)
}

const renderActiveShape = props => {
  const {
    cx,
    cy,
    startAngle,
    endAngle,
    payload,
    percent,
    value,
    coin,
    innerRadius,
    outerRadius
  } = props

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-8}
        textAnchor="middle"
        fontSize="12px"
        fontWeight={800}
      >
        {payload.name
          ? capitalizeFirstLetter(payload.name)
          : capitalizeFirstLetter(payload.category)}
      </text>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fontSize="12px"
        fontWeight={500}
      >
        {formatWithThousandSeparator(value, 2)} {coin}
      </text>
      <text
        x={cx}
        y={cy}
        dy={24}
        textAnchor="middle"
        fontSize="12px"
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color}
      />
    </g>
  )
}

const PieChartReport = ({
  data,
  keyTranslation,
  pathTranslation,
  typeData,
  innerRadius = 60,
  outerRadius = 150
}) => {
  const classes = useStyles()
  const [activeIndex, setActiveIndex] = useState(0)
  const [getPiePng, { ref: pieRef }] = useCurrentPng()
  const { t } = useTranslation()
  const [selectedUSD, setSelected] = useState(false)
  const [coinType, setCoinType] = useState('EOS')
  const [category, setCategory] = useState('')

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const newData = data.map(info => {
    return { ...info, coin: coinType }
  })

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handlePieDownload = useCallback(async () => {
    const png = await getPiePng()

    if (png) {
      FileSaver.saveAs(png, 'pie-chart.png')
    }
  }, [getPiePng])

  useEffect(() => {
    if (typeData === 'income') {
      setCategory('CLAIMED')
    } else {
      setCategory('CATEGORIZED')
    }
  }, [typeData])

  useEffect(() => {
    selectedUSD ? setCoinType('USD') : setCoinType('EOS')
  }, [selectedUSD])

  return (
    <div className={classes.chartContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <Typography className={classes.titleChart} variant="span">
            {t(keyTranslation, { ns: pathTranslation })}
          </Typography>
          <TooltipDownload title="Donwload">
            <IconButton onClick={handlePieDownload}>
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
      {typeData === 'expense' && <Divider variant="middle" />}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart ref={pieRef}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={newData}
            nameKey={typeData === 'delegate' ? 'category' : 'name'}
            dataKey={
              typeData === 'delegate'
                ? `${coinType}`
                : `${coinType}_${category.toLocaleUpperCase()}`
            }
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            onMouseEnter={onPieEnter}
          >
            {data.map(data => (
              <Cell key={`cell-${data.election}`} fill={data.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

PieChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  typeData: PropTypes.string,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number
}

export default memo(PieChartReport)
