import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material'

import styles from './styles'
import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'
import IncomeChart from './IncomeChart'
import IncomeTable from './IncomeTable'
import IncomeSelect from './IncomeSelect'

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
      electionsByYearList
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
    <Box>
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              paddingLeft={2}
            >
              <label className={classes.eosBalance}>{t('title')}</label>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="end">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="end"
                className={classes.eosPriceContainer}
              >
                <label className={classes.eosPriceTitle}>
                  {t('titleEosBalance')}
                </label>
                <label className={classes.eosBalance}>
                  {Number(currencyBalance.split(' ')[0]).toFixed(2)} EOS
                </label>
                <label className={classes.eosBalanceInDollars}>
                  $
                  {(eosRate * Number(currencyBalance.split(' ')[0])).toFixed(2)}{' '}
                  @ ${eosRate.toFixed(2)}/EOS
                </label>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box marginTop={2} paddingLeft={2}>
          {t('textInformation')}
          <br />
          Next disbursement date: June 8, 2022
        </Box>
        <Box display="flex" justifyContent="end">
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
        </Box>
      </Box>

      <IncomeChart data={chartTransactionsList} coinType={typeCurrencySelect} />

      <Box m={4}>
        <span className={classes.tableTitle}>{t('titleTable')}</span>
        <Box mt={2}>
          <IncomeTable data={chartTransactionsList} />
        </Box>
      </Box>
    </Box>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
