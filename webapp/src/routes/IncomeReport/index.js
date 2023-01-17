import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider
} from '@mui/material'

import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'
import LineChartReport from '../../components/LineChartReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import BarChartReport from '../../components/BarChartReport'
import PieChartReport from '../../components/PieChartReport'
import SelectComponent from '../../components/Select'

import TreasuryDisbursementsInfo from './treasury-disbursements-info'
import IncomeTableReport from './income-table-report'
import styles from './styles'

const useStyles = makeStyles(styles)

const IncomeReport = () => {
  const classes = useStyles()

  const { t } = useTranslation()

  const [
    {
      incomeByElectionsList,
      electionsList,
      delegatesList,
      treasuryList,
      electionRoundSelect,
      showElectionRadio,
      delegatesActualElectionList,
      ranksList
    },
    { setElectionRoundSelect, setShowElectionRadio }
  ] = useIncomeReportState()

  const tableData =
    showElectionRadio === 'allElections' ? incomeByElectionsList : delegatesList

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
      </div>
      <TreasuryDisbursementsInfo
        delegatesActualElectionList={delegatesActualElectionList}
        ranksList={ranksList}
      />
      <LineChartReport
        data={treasuryList}
        keyTranslation={'titleLineChart'}
        pathTranslation={'incomeRoute'}
      />
      <BarChartReport
        data={incomeByElectionsList}
        keyTranslation={'titleBarChart'}
        pathTranslation={'incomeRoute'}
        showLegend={true}
        typeData={'income'}
      />
      <Divider variant="middle" />
      <div className={classes.filtersContainer}>
        <div id="id-radio-election-container">
          <FormControl>
            <RadioGroup
              name="election-radio-buttons-group"
              row
              onChange={({ target }) => setShowElectionRadio(target.value)}
              value={showElectionRadio}
            >
              <FormControlLabel
                control={<Radio size="small" />}
                label={t('textRadioButton4', { ns: 'generalForm' })}
                value="allElections"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                label={t('textRadioButton3', { ns: 'generalForm' })}
                value="oneElection"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div id="id-radio-election-container">
          {showElectionRadio === 'oneElection' && (
            <>
              <SelectComponent
                onChangeFunction={setElectionRoundSelect}
                labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
                values={electionsList.map(data => `${data.election}`)}
                actualValue={electionRoundSelect}
                size="small"
              />
            </>
          )}
        </div>
      </div>

      <PieChartReport
        data={delegatesList}
        keyTranslation={'titlePieChart'}
        pathTranslation={'incomeRoute'}
        typeData={'income'}
      />
      <Divider variant="middle" />
      <IncomeTableReport
        tableData={tableData}
        showElectionRadio={showElectionRadio}
      />
    </div>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
