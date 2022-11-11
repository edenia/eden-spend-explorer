import React, { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'

import useDelegateReportState from '../../hooks/customHooks/useDelegateReportState'
import StackedBarChartReport from '../../components/StackedBarChartReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'

import styles from './styles'

const useStyles = makeStyles(styles)

const DelegateReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [
    {
      electionRoundSelect,
      delegateSelect,
      electionsByYearList,
      transactionList,
      categoryList,
      delegateList
    },
    { setElectionRoundSelect, setElectionYearSelect, setDelegateSelect }
  ] = useDelegateReportState()

  console.log(transactionList)
  console.log(categoryList)

  useEffect(() => {
    setElectionYearSelect('All')
  }, [])

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
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
              value={delegateSelect}
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
        <StackedBarChartReport
          data={transactionList}
          keyTranslation={'titleBarChart'}
          pathTranslation={'delegateRoute'}
          showLegend={true}
        />
      </div>
    </div>
  )
}

export default memo(DelegateReport)
