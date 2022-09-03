import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Container
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
    <>
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              paddingLeft={2}
            >
              <Box width="4px" height="31px" bgcolor="#00c2bf" />
              <Box className={classes.title}>
                <Typography variant="span">{t('title')}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
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

        <Container>
          <Box textAlign="justify" marginTop={2}>
            <Typography variant="span" className={classes.subTitle}>
              {t('subTitle')}
            </Typography>
            <br />
            <Typography variant="span">
              {t('textInformation')}
              <br />
              Next disbursement date: June 8, 2022
            </Typography>
          </Box>

          <Grid marginTop={1} container spacing={2}>
            <Grid item xs={12} sm={5}>
              <Box className={classes.filtersContainer}>
                <FormControl>
                  <RadioGroup
                    name="controlled-radio-buttons-group"
                    value={showDelegateRadio}
                    row
                    onChange={({ target }) =>
                      setShowDelegateRadio(target.value)
                    }
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box className={classes.filtersContainer}>
                <IncomeSelect
                  onChangeFunction={setElectionYearSelect}
                  labelSelect={t('textYearSelect')}
                  values={getListElectionYears()}
                  actualValue={electionYearSelect}
                />
                <IncomeSelect
                  onChangeFunction={setElectionRoundSelect}
                  labelSelect={t('textElectionSelect')}
                  values={electionsByYearList.map(
                    data => `${data.election_round}`
                  )}
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
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container>
        <IncomeChart
          data={chartTransactionsList}
          coinType={typeCurrencySelect}
        />

        <Box m={4}>
          <Typography variant="spand" className={classes.subTitle}>
            {t('titleTable')}
          </Typography>
          <Box mt={2}>
            <IncomeTable data={chartTransactionsList} />
          </Box>
        </Box>
      </Container>
    </>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
