import React, { memo } from 'react'
import { Divider } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import useExpenseReportState from '../../hooks/customHooks/useExpenseReportState'
import TreasuryBalance from '../../components/TreasuryBalance'
import BarChartReport from '../../components/BarChartReport'
import PieChartReport from '../../components/PieChartReport'
import RadioFilter from '../../components/RadioFilter'
import SelectComponent from '../../components/Select'

import styles from './styles'
import ExpenseTableReport from './expense-table-report'

const useStyles = makeStyles(styles)

const ExpenseReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [
    {
      expenseByElectionsList,
      electionsList,
      delegatesList,
      categoryList,
      electionRoundSelect,
      showElectionRadio
    },
    { setElectionRoundSelect, setShowElectionRadio }
  ] = useExpenseReportState()

  const tableData =
    showElectionRadio === 'allElections'
      ? expenseByElectionsList
      : delegatesList

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
      </div>
      <BarChartReport
        data={expenseByElectionsList}
        keyTranslation={'titleBarChart'}
        pathTranslation={'expenseRoute'}
        typeData={'expense'}
      />
      <Divider variant="middle" />
      <div className={classes.filtersContainer}>
        <div id="id-radio-election-container">
          <RadioFilter
            setValue={setShowElectionRadio}
            label1={t('textRadioButton4', { ns: 'generalForm' })}
            value1="allElections"
            label2={t('textRadioButton3', { ns: 'generalForm' })}
            value2="oneElection"
            defaultValue={showElectionRadio}
          />
        </div>
        {showElectionRadio === 'oneElection' && (
          <div id="id-radio-election-container">
            <SelectComponent
              onChangeFunction={setElectionRoundSelect}
              labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
              values={electionsList.map(data => `${data.election}`)}
              actualValue={electionRoundSelect}
              size="small"
            />
          </div>
        )}
      </div>
      <div className={classes.chartContainer}>
        <div className={classes.pieChartContainer}>
          <PieChartReport
            data={categoryList}
            keyTranslation={'titlePieChart1'}
            pathTranslation={'expenseRoute'}
            typeData={'expense'}
          />
        </div>
        <div className={classes.dividerLine} />
        <div className={classes.pieChartContainer}>
          <PieChartReport
            data={delegatesList}
            keyTranslation={'titlePieChart2'}
            pathTranslation={'expenseRoute'}
            typeData={'expense'}
          />
        </div>
      </div>
      <Divider variant="middle" />
      <ExpenseTableReport
        tableData={tableData}
        showElectionRadio={showElectionRadio}
      />
    </div>
  )
}

export default memo(ExpenseReport)
