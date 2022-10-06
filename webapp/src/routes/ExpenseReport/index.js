import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import useExpenseReport from '../../hooks/customHooks/useExpenseReportState'
import LineAreaReportChart from '../../components/LineAreaReportChart'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'
import TableReport from '../../components/TableReport'

import styles from './styles'

const useStyles = makeStyles(styles)

const ExpenseReport = () => {
  const classes = useStyles()
  const { t } = useTranslation('expenseRoute')
  const { t: t2 } = useTranslation('generalForm')

  const [
    {
      showElectionRadio,
      showDelegateRadio,
      typeCurrencySelect,
      showEosRateSwitch,
      electionYearSelect,
      delegateSelect,
      electionRoundSelect,
      electionsByYearList,
      expenseByAllDelegatesList,
      chartTransactionsList
    },
    {
      setShowElectionRadio,
      setShowDelegateRadio,
      setTypeCurrencySelect,
      setShowEosRateSwitch,
      setElectionYearSelect,
      setDelegateSelect,
      setElectionRoundSelect,
      getListElectionYears
    }
  ] = useExpenseReport()

  return (
    <div className={classes.root}>
      <div id="titles-container-id">
        <div className={classes.titleContainer}>
          <div className={classes.divider} />
          <div className={classes.title}>
            <Typography variant="span">{t('title')}</Typography>
          </div>
        </div>
        <TreasuryBalance />
      </div>
      <div className={classes.subTitle}>
        <Typography variant="span">{t('subTitle')}</Typography>
        <br />
        <label>{t('textInformation')}</label>
      </div>
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
                label={t2('textRadioButton4')}
                value="allElections"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                label={t2('textRadioButton3')}
                value="oneElection"
              />
            </RadioGroup>
          </FormControl>
          <SelectComponent
            onChangeFunction={setTypeCurrencySelect}
            labelSelect={t2('textCurrencySelect')}
            values={['EOS', 'USD']}
            actualValue={typeCurrencySelect}
          />
        </div>
        <div id="id-select-election-container">
          {showElectionRadio === 'oneElection' && (
            <>
              <FormControl>
                <FormControlLabel
                  label={t('exchangeRate')}
                  control={
                    <Switch
                      checked={showEosRateSwitch}
                      onChange={({ target }) =>
                        setShowEosRateSwitch(target.checked)
                      }
                    />
                  }
                />
              </FormControl>
              <FormControl>
                <RadioGroup
                  name="controlled-radio-buttons-group"
                  value={showDelegateRadio}
                  row
                  onChange={({ target }) => setShowDelegateRadio(target.value)}
                >
                  <FormControlLabel
                    control={<Radio size="small" />}
                    label={t2('textRadioButton2')}
                    value="allDelegates"
                  />
                  <FormControlLabel
                    control={<Radio size="small" />}
                    label={t2('textRadioButton1')}
                    value="oneDelegate"
                  />
                </RadioGroup>
              </FormControl>
              <SelectComponent
                onChangeFunction={setElectionYearSelect}
                labelSelect={t2('textYearSelect')}
                values={getListElectionYears()}
                actualValue={electionYearSelect}
              />
              <SelectComponent
                onChangeFunction={setElectionRoundSelect}
                labelSelect={t2('textElectionSelect')}
                values={electionsByYearList.map(data => `${data.election}`)}
                actualValue={electionRoundSelect}
              />
              <SelectComponent
                onChangeFunction={setDelegateSelect}
                labelSelect={t2('textDelegateSelect')}
                values={expenseByAllDelegatesList.map(
                  data => data.eden_delegate.account
                )}
                disable={showDelegateRadio === 'allDelegates'}
                actualValue={delegateSelect}
              />
            </>
          )}
        </div>
      </div>
      <div>
        <LineAreaReportChart
          data={chartTransactionsList}
          coinType={typeCurrencySelect}
          showEosRate={showEosRateSwitch}
        />
      </div>
      <div className={classes.tableContainer}>
        <div className={classes.subTitle}>
          <div id="id-table-container">
            <TableReport
              data={[]}
              dataPercent={chartTransactionsList}
              showDelegateRadio={showDelegateRadio}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ExpenseReport)
