import React, { memo, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
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

import styles from './styles'
import CustomPieChart from './custom-pieChart'

const useStyles = makeStyles(styles)

const PieChartReport = ({
  data,
  keyTranslation,
  pathTranslation,
  typeData
}) => {
  const classes = useStyles()
  const [getPiePng, { ref: pieRef }] = useCurrentPng()
  const { t } = useTranslation()
  const [selectedUSD, setSelected] = useState(false)
  const [coinType, setCoinType] = useState('EOS')

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const handlePieDownload = useCallback(async () => {
    const png = await getPiePng()

    if (png) {
      FileSaver.saveAs(png, 'pie-chart.png')
    }
  }, [getPiePng])

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
          <TooltipDownload title={t('download', { ns: 'common' })}>
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
      <CustomPieChart
        data={data}
        coinType={coinType}
        typeData={typeData}
        pieRef={pieRef}
      />
    </div>
  )
}

PieChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  typeData: PropTypes.string
}

export default memo(PieChartReport)
