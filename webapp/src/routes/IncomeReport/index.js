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
      nextEdenDisbursement
    },
    {
      setTypeCurrencySelect,
      getListElectionYears,
      setElectionYearSelect,
      setElectionRoundSelect,
      setShowDelegateRadio,
      setDelegateSelect
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
            {Number(currencyBalance.split(' ')[0]).toFixed(2)} EOS
          </label>
          <label className={classes.eosBalanceInDollars}>
            ${(eosRate * Number(currencyBalance.split(' ')[0])).toFixed(2)} @ $
            {eosRate.toFixed(2)}/EOS
          </label>
        </div>
      </div>
      <div className={classes.subTitle}>
        <Typography variant="span">{t('subTitle')}</Typography>
        <br />
        <label>
          {t('textInformation')}
          <br />
          {`${t('nextDisbursement')} ${nextEdenDisbursement}`}
        </label>
      </div>

      <div className={classes.filtersContainer}>
        <FormControl>
          <RadioGroup
            name="controlled-radio-buttons-group"
            value={showDelegateRadio}
            row
            onChange={({ target }) => setShowDelegateRadio(target.value)}
          >
            <FormControlLabel
              control={<Radio size="small" />}
              label={t('textRadioButton1')}
              value="oneDelegate"
            />
            <FormControlLabel
              control={<Radio size="small" />}
              label={t('textRadioButton2')}
              value="allDelegates"
            />
          </RadioGroup>
        </FormControl>
        <div>
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
            onChangeFunction={setTypeCurrencySelect}
            labelSelect={t('textCurrencySelect')}
            values={['EOS', 'USD']}
            actualValue={typeCurrencySelect}
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
        </div>
      </div>

      <IncomeChart data={chartTransactionsList} coinType={typeCurrencySelect} />

      <div className={classes.tableContainer}>
        <div className={classes.subTitle}>
          <Typography variant="span">{t('titleTable')}</Typography>
          <IncomeTable data={chartTransactionsList} />
        </div>
      </div>
    </div>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
