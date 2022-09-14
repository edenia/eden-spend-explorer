import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'

import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'

import IncomeClaimedChart from './IncomeClaimedChart'
import IncomeChart from './IncomeChart'
import IncomeTable from './IncomeTable'
import IncomeSelect from './IncomeSelect'
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
      incomeClaimedAndUnclaimedList
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
                label={'All Elections'}
                value="allElections"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                label={'One Election'}
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

      <IncomeChart data={chartTransactionsList} coinType={typeCurrencySelect} />

      <IncomeClaimedChart
        data={incomeClaimedAndUnclaimedList}
        coinType={typeCurrencySelect}
      />

      <div className={classes.tableContainer}>
        <div className={classes.subTitle}>
          <Typography variant="span">
            {chartTransactionsList[0]?.level
              ? t('titleTable')
              : t('titleTable2')}
          </Typography>

          <IncomeTable data={chartTransactionsList} />
        </div>
      </div>
    </div>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
