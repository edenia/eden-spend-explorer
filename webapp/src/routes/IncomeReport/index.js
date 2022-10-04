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

import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'
import IncomeChart from './IncomeChart'
import IncomeStackedChart from './IncomeStackedChart'
import IncomePieChart from './IncomePieChart'
import IncomeSelect from './IncomeSelect'
import IncomeTable from './IncomeTable'
import styles from './styles'

const useStyles = makeStyles(styles)

const IncomeReport = () => {
  const [
    {
      currencyBalance,
      eosRate,
      chartTransactionsList,
      typeCurrencySelect,
      electionYearSelect,
      electionRoundSelect,
      showDelegateRadio,
      delegateSelect,
      incomeByAllDelegatesList,
      electionsByYearList,
      nextEdenDisbursement,
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
      thousandSeparator,
      setShowElectionRadio
    }
  ] = useIncomeReportState()

  const classes = useStyles()

  const { t } = useTranslation('incomeRoute')

  const [showEosRateSwitch, setshowEosRateSwitch] = useState(true)

  return (
    <div className={classes.root}>
      <div id="titles-container-id">
        <div className={classes.titleContainer}>
          <div className={classes.divider} />
          <div className={classes.title}>
            <Typography variant="span">{t('title')}</Typography>
          </div>
        </div>
        <div className={classes.eosPriceContainer}>
          <label className={classes.eosPriceTitle}>
            {t('titleEosBalance')}
          </label>
          <label className={classes.eosBalance}>
            {thousandSeparator(
              Number(currencyBalance.split(' ')[0]).toFixed(2)
            )}{' '}
            EOS
          </label>
          <label className={classes.eosBalanceInDollars}>
            $
            {thousandSeparator(
              (eosRate * Number(currencyBalance.split(' ')[0])).toFixed(2)
            )}{' '}
            @ ${eosRate.toFixed(2)}/EOS
          </label>
        </div>
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
                label={t('textRadioButton4')}
                value="allElections"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                label={t('textRadioButton3')}
                value="oneElection"
              />
            </RadioGroup>
          </FormControl>
          <IncomeSelect
            onChangeFunction={setTypeCurrencySelect}
            labelSelect={t('textCurrencySelect')}
            values={['EOS', 'USD']}
            actualValue={typeCurrencySelect}
          />
        </div>
        <div id="id-select-election-container">
          {showElectionRadio === 'oneElection' && (
            <>
              <FormControl>
                <FormControlLabel
                  label={t('chartExchangeRateEos')}
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
                    label={t('textRadioButton2')}
                    value="allDelegates"
                  />
                  <FormControlLabel
                    control={<Radio size="small" />}
                    label={t('textRadioButton1')}
                    value="oneDelegate"
                  />
                </RadioGroup>
              </FormControl>
              <IncomeSelect
                onChangeFunction={setElectionYearSelect}
                labelSelect={t('textYearSelect')}
                values={getListElectionYears()}
                actualValue={electionYearSelect}
              />
              <IncomeSelect
                onChangeFunction={setElectionRoundSelect}
                labelSelect={t('textElectionSelect')}
                values={electionsByYearList.map(data => `${data.election}`)}
                actualValue={electionRoundSelect}
              />
              <IncomeSelect
                onChangeFunction={setDelegateSelect}
                labelSelect={t('textDelegateSelect')}
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
        thousandSeparator={thousandSeparator}
      />

      <div className={classes.chartContainer}>
        <IncomeStackedChart
          data={incomeClaimedAndUnclaimedList}
          coinType={typeCurrencySelect}
          showEosRate={showEosRateSwitch}
          thousandSeparator={thousandSeparator}
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
              thousandSeparator={thousandSeparator}
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
