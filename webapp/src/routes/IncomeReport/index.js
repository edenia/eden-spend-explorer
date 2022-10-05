import React, { memo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography
} from '@mui/material'

import { useSharedState } from '../../context/state.context'
import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'

import IncomeChart from './IncomeChart'
import IncomeStackedChart from './IncomeStackedChart'
import IncomePieChart from './IncomePieChart'
import IncomeTable from './IncomeTable'
import styles from './styles'

const useStyles = makeStyles(styles)

const IncomeReport = () => {
  const [
    {
      chartTransactionsList,
      typeCurrencySelect,
      electionYearSelect,
      electionRoundSelect,
      showDelegateRadio,
      delegateSelect,
      incomeByAllDelegatesList,
      electionsByYearList,
      showElectionRadio,
      incomeClaimedAndUnclaimedList,
      totalClaimedAndUnclaimedList,
      percentIncomeList
    },
    {
      setTypeCurrencySelect,
      getListElectionYears,
      setElectionYearSelect,
      setElectionRoundSelect,
      setShowDelegateRadio,
      setDelegateSelect,
      setShowElectionRadio
    }
  ] = useIncomeReportState()

  const classes = useStyles()

  const { t } = useTranslation('incomeRoute')

  const { t: t2 } = useTranslation('generalForm')

  const [showEosRateSwitch, setshowEosRateSwitch] = useState(true)

  const [state] = useSharedState()

  const { nextEdenDisbursement = '' } = state.eosTrasuryBalance

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
        <label>
          {t('textInformation')}
          <br />
          <strong>{`${t('nextDisbursement')} ${nextEdenDisbursement}`}</strong>
        </label>
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
                        setshowEosRateSwitch(target.checked)
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
                values={incomeByAllDelegatesList.map(
                  data => data.eden_delegate.account
                )}
                disable={showDelegateRadio === 'allDelegates'}
                actualValue={delegateSelect}
              />
            </>
          )}
        </div>
      </div>

      <IncomeChart
        data={chartTransactionsList}
        coinType={typeCurrencySelect}
        showEosRate={showEosRateSwitch}
      />

      <div className={classes.chartContainer}>
        <IncomeStackedChart
          data={incomeClaimedAndUnclaimedList}
          coinType={typeCurrencySelect}
          showEosRate={showEosRateSwitch}
        />

        <IncomePieChart
          data={totalClaimedAndUnclaimedList}
          coinType={typeCurrencySelect}
        />
      </div>

      <div className={classes.tableContainer}>
        <div className={classes.subTitle}>
          <Typography variant="span">
            {chartTransactionsList[0]?.level
              ? t('titleTable')
              : t('titleTable2')}
          </Typography>

          <div id="id-table-container">
            <IncomeTable
              data={chartTransactionsList}
              dataPercent={percentIncomeList}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
