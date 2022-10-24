import React, { memo, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'

import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'
import LineAreaChartReport from '../../components/LineAreaChartReport'
import StackedChartReport from '../../components/StackedChartReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import PieChartReport from '../../components/PieChartReport'
import { useSharedState } from '../../context/state.context'
import TableReport from '../../components/TableReport'
import SelectComponent from '../../components/Select'

import styles from './styles'
import { formatWithThousandSeparator } from '../../utils'

const useStyles = makeStyles(styles)

const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const IncomeReport = () => {
  const classes = useStyles()

  const { t } = useTranslation()
  const [showEosRateSwitch, setshowEosRateSwitch] = useState(true)
  const [state] = useSharedState()
  const { nextEdenDisbursement = '' } = state.eosTrasuryBalance

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
      totalByCategoryList,
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

  useEffect(() => {
    setShowElectionRadio('oneElection')
  }, [])

  const tableData = chartTransactionsList.map(firstObj => ({
    ...percentIncomeList.find(secondObj => secondObj.name === firstObj.name),
    ...firstObj
  }))

  const columns = [
    {
      field: 'txId',
      headerName: t('tableHeader2', { ns: 'incomeRoute' }),
      hide: !tableData[0]?.txId,
      cellClassName: classes.links,
      renderCell: param => (
        <Tooltip title={param.value}>
          <a
            href={
              param.value.length > 60
                ? `https://bloks.io/transaction/${param.value}`
                : `https://bloks.io/account/genesis.eden?loadContract=true&tab=Tables&table=distaccount&account=genesis.eden&scope=&limit=100&lower_bound=${param.value}&upper_bound=${param.value}`
            }
          >
            {param.value.slice(0, 8)}
          </a>
        </Tooltip>
      ),
      ...rowsCenter
    },
    {
      field: 'name',
      headerName: tableData[0]?.level
        ? t('tableHeader1', { ns: 'incomeRoute' })
        : t('tableElectionHeader', { ns: 'incomeRoute' }),
      cellClassName: classes.links,
      renderCell: param => (
        <a
          className={tableData[0]?.level ? '' : classes.disableLink}
          href={`https://eosauthority.com/account/${param.value}?network=eos`}
        >
          {param.value}
        </a>
      ),
      ...rowsCenter
    },
    {
      field: 'level',
      headerName: t('tableHeader3', { ns: 'incomeRoute' }),
      hide: !tableData[0]?.level,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'category',
      headerName: t('tableHeader11', { ns: 'incomeRoute' }),
      renderCell: param => (
        <>
          {param.value === 'claimed'
            ? t('claimedCategory', { ns: 'incomeRoute' })
            : t('unclaimedCategory', { ns: 'incomeRoute' })}
        </>
      ),
      hide: !tableData[0]?.category,
      ...rowsCenter
    },
    {
      field: 'EOS',
      headerName: 'EOS',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'USD',
      headerName: 'USD',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'date',
      headerName: t('tableHeader6', { ns: 'incomeRoute' }),
      hide: !tableData[0]?.date,
      ...rowsCenter
    },
    {
      field: 'EOS_CLAIMED',
      headerName: t('tableHeader7', { ns: 'incomeRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    },
    {
      field: 'EOS_UNCLAIMED',
      headerName: t('tableHeader8', { ns: 'incomeRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    },
    {
      field: 'USD_CLAIMED',
      headerName: t('tableHeader9', { ns: 'incomeRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    },
    {
      field: 'USD_UNCLAIMED',
      headerName: t('tableHeader10', { ns: 'incomeRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    }
  ]

  return (
    <div className={classes.root}>
      <div id="titles-container-id">
        <div className={classes.titleContainer}>
          <div className={classes.divider} />
          <div className={classes.title}>
            <Typography variant="span">
              {t('title', { ns: 'incomeRoute' })}
            </Typography>
          </div>
        </div>
        <TreasuryBalance />
      </div>
      <div className={classes.subTitle}>
        <Typography variant="span">
          {t('subTitle', { ns: 'incomeRoute' })}
        </Typography>
        <br />
        <label>
          {t('textInformation', { ns: 'incomeRoute' })}
          <br />
          <strong>{`${t('nextDisbursement', {
            ns: 'incomeRoute'
          })} ${nextEdenDisbursement}`}</strong>
        </label>
      </div>

      <div className={classes.filtersContainer}>
        <div id="id-radio-election-container">
          <SelectComponent
            onChangeFunction={setTypeCurrencySelect}
            labelSelect={t('textCurrencySelect', { ns: 'generalForm' })}
            values={['EOS', 'USD']}
            actualValue={typeCurrencySelect}
          />
        </div>
        <div id="id-select-election-container">
          <>
            <FormControl>
              <FormControlLabel
                label={t('exchangeRate', { ns: 'incomeRoute' })}
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
                  label={t('textRadioButton2', { ns: 'generalForm' })}
                  value="allDelegates"
                />
                <FormControlLabel
                  control={<Radio size="small" />}
                  label={t('textRadioButton1', { ns: 'generalForm' })}
                  value="oneDelegate"
                />
              </RadioGroup>
            </FormControl>
            <SelectComponent
              onChangeFunction={setElectionYearSelect}
              labelSelect={t('textYearSelect', { ns: 'generalForm' })}
              values={getListElectionYears()}
              actualValue={electionYearSelect}
            />
            <SelectComponent
              onChangeFunction={setElectionRoundSelect}
              labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
              values={electionsByYearList.map(data => `${data.election}`)}
              actualValue={electionRoundSelect}
            />
            <SelectComponent
              onChangeFunction={setDelegateSelect}
              labelSelect={t('textDelegateSelect', { ns: 'generalForm' })}
              values={incomeByAllDelegatesList.map(
                data => data.eden_delegate.account
              )}
              disable={showDelegateRadio === 'allDelegates'}
              actualValue={delegateSelect}
            />
          </>
        </div>
      </div>

      <div>
        <Typography variant="h5">
          {t('titleComposeChartDelegate', { ns: 'incomeRoute' })}
        </Typography>
        <LineAreaChartReport
          data={chartTransactionsList}
          coinType={typeCurrencySelect}
          showEosRate={showEosRateSwitch}
        />
      </div>

      <div className={classes.chartContainer}>
        <div>
          <Typography variant="h6">
            {t('titleStackedChartDelegate', { ns: 'incomeRoute' })}
          </Typography>
          <StackedChartReport
            data={incomeClaimedAndUnclaimedList}
            firstCategory={`CLAIMED`}
            secondCategory={`UNCLAIMED`}
            typeCurrency={typeCurrencySelect}
            showEosRate={showEosRateSwitch}
          />
        </div>
        <div>
          <Typography variant="h6">
            {t('titlePieChartDelegate', { ns: 'incomeRoute' })}
          </Typography>
          <PieChartReport
            data={totalByCategoryList}
            coinType={typeCurrencySelect}
          />
        </div>
      </div>

      <div className={classes.tableContainer}>
        <div className={classes.subTitle}>
          <Typography variant="span">
            {chartTransactionsList[0]?.level
              ? t('titleTable', { ns: 'incomeRoute' })
              : t('titleTable2', { ns: 'incomeRoute' })}
          </Typography>

          <div id="id-table-container">
            <TableReport columns={columns} dataPercent={tableData} />
          </div>
        </div>
      </div>
    </div>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
