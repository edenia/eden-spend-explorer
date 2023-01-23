import React, { memo, useCallback, useEffect, useState } from 'react'
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
  FormGroup,
  Button
} from '@mui/material'

import Select from '../Select'

import styles from './styles'
import CustomLineChart from './custom-lineChart'

const useStyles = makeStyles(styles)

const LineChartReport = ({
  data,
  keyTranslation,
  pathTranslation,
  historicElections
}) => {
  const classes = useStyles()
  const [getBarPng, { ref: lineRef }] = useCurrentPng()
  const { t } = useTranslation()
  const [selectedUSD, setSelected] = useState(false)
  const [coinType, setCoinType] = useState('EOS')
  const [viewSelected, setViewSelect] = useState('')
  const [dataChart, setDataChart] = useState([])
  const [electionRoundSelect, setElectionRoundSelect] = useState('')

  const handleChange = event => {
    setSelected(event.target.checked)
  }

  const handleBarDownload = useCallback(async () => {
    const png = await getBarPng()

    if (png) {
      FileSaver.saveAs(png, 'line-chart.png')
    }
  }, [getBarPng])

  const handleSelectElection = e => {
    setViewSelect(e.target.value)
  }

  useEffect(() => {
    setDataChart(data)
  }, [data])

  useEffect(() => {
    if (selectedUSD) {
      setCoinType('USD')
    } else {
      setCoinType('EOS')
    }
  }, [selectedUSD])

  useEffect(() => {
    if (viewSelected === 'last') {
      const count = historicElections.length - 2 || 0
      const date = historicElections?.at(count)?.date_election.split('T')[0]
      const subData = data?.filter(obj => obj.date >= date)
      setDataChart(subData)
    }
    if (viewSelected === 'all') setDataChart(data)
  }, [viewSelected])

  useEffect(() => {
    if (!electionRoundSelect) return
    const index = historicElections.findIndex(
      election => Number(election.election) === Number(electionRoundSelect)
    )
    const subData = data?.filter(
      objt =>
        objt.date >= historicElections[index].date_election &&
        objt.date <= historicElections[index + 1]?.date_election
    )
    setViewSelect(electionRoundSelect)

    setDataChart(subData)
  }, [electionRoundSelect])

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
      <div className={classes.buttonFilter}>
        <div>
          <Button
            size="small"
            variant="contained"
            onClick={handleSelectElection}
            value="all"
          >
            all
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={handleSelectElection}
            value="last"
          >
            Estimated treasury
          </Button>
        </div>
        <Select
          onChangeFunction={setElectionRoundSelect}
          labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
          values={historicElections.map(data => `${data.election}`)}
          actualValue={electionRoundSelect}
          width={110}
          size="small"
        />
      </div>
      <div className={classes.chartContainer}>
        <CustomLineChart
          coinType={coinType}
          data={dataChart}
          lineRef={lineRef}
        />
      </div>
    </div>
  )
}

LineChartReport.propTypes = {
  data: PropTypes.array,
  keyTranslation: PropTypes.string,
  pathTranslation: PropTypes.string,
  historicElections: PropTypes.array
}

export default memo(LineChartReport)
