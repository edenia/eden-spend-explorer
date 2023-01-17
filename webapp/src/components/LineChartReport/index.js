import React, { memo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useCurrentPng } from 'recharts-to-png'
import TooltipDownload from '@mui/material/Tooltip'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import {
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  FormGroup
} from '@mui/material'

import styles from './styles'
import CustomLineChart from './custom-lineChart'

const useStyles = makeStyles(styles)

const LineChartReport = ({ data, keyTranslation, pathTranslation }) => {
  const classes = useStyles()
  const [getBarPng, { ref: lineRef }] = useCurrentPng()
  const { t } = useTranslation()
  const [selectedUSD, setSelected] = useState(false)

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const handleBarDownload = useCallback(async () => {
    const png = await getBarPng()

    if (png) {
      FileSaver.saveAs(png, 'line-chart.png')
    }
  }, [getBarPng])

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
        <CustomLineChart
          selectedUSD={selectedUSD}
          data={data}
          lineRef={lineRef}
        />
      </div>
    </div>
  )
}

LineChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string
}

export default memo(LineChartReport)
