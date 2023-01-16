import React, { memo, useCallback, useState } from 'react'
import DownloadOutlined from '@mui/icons-material/DownloadOutlined'
import TooltipDownload from '@mui/material/Tooltip'
import { useCurrentPng } from 'recharts-to-png'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import {
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  FormGroup
} from '@mui/material'

import CustomBarchart from './custom-barchart'
import styles from './styles'

const useStyles = makeStyles(styles)

const BarChartReport = ({
  data,
  keyTranslation,
  pathTranslation,
  showLegend,
  typeData
}) => {
  const classes = useStyles()
  const [getBarPng, { ref: barRef }] = useCurrentPng()
  const { t } = useTranslation()
  const [selectedUSD, setSelected] = useState(false)

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const handleBarDownload = useCallback(async () => {
    const png = await getBarPng()

    if (png) {
      FileSaver.saveAs(png, 'bar-chart.png')
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
        <CustomBarchart
          barRef={barRef}
          showLegend={showLegend}
          data={data}
          typeData={typeData}
        />
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
