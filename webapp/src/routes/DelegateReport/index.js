import React, { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'

import useDelegateReportState from '../../hooks/customHooks/useDelegateReportState'
import BarChartGeneralReport from '../../components/BarChartGeneralReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'

import styles from './styles'

const useStyles = makeStyles(styles)

const DelegateReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [
    { electionRoundSelect, electionsByYearList, transactionList, delegateList },
    { setElectionRoundSelect, setElectionYearSelect, setDelegateSelect }
  ] = useDelegateReportState()

  useEffect(() => {
    setElectionYearSelect('All')
  }, [])

  return (
    <div className={classes.root}>
      <div id="titles-container-id">
        <div className={classes.titleContainer}>
          <div className={classes.divider} />
          <div className={classes.title}>
            <Typography variant="span">
              {t('title', { ns: 'expenseRoute' })}
            </Typography>
          </div>
        </div>
        <TreasuryBalance />
      </div>
      <div className={classes.subTitle}>
        <Typography variant="span">
          {t('subTitle', { ns: 'expenseRoute' })}
        </Typography>
        <br />
        <label>{t('textInformation', { ns: 'expenseRoute' })}</label>
      </div>
      <div className={classes.filtersContainer}>
        <div id="id-select-election-container">
          <>
            <SelectComponent
              onChangeFunction={setElectionRoundSelect}
              labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
              values={electionsByYearList.map(data => `${data.election}`)}
              actualValue={electionRoundSelect}
            />
            <Autocomplete
              id="combo-box-demo"
              sx={{ width: 300 }}
              options={delegateList.map(data => data.delegate_payer)}
              onInputChange={(event, newInputValue) => {
                setDelegateSelect(newInputValue)
              }}
              autoHighlight
              clearOnEscape
              renderInput={params => (
                <TextField {...params} label="Delegate" variant="standard" />
              )}
            />
          </>
        </div>
      </div>
      <div className={classes.chartContainer}>
        <BarChartGeneralReport
          data={transactionList}
          keyTranslation={'titleAreaChartGeneral1'}
          pathTranslation={'incomeRoute'}
          showLegend={true}
          typeData={'delegate'}
        />
      </div>
    </div>
  )
}

export default memo(DelegateReport)
