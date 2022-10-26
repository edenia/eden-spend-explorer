import React, { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import useExpenseReport from '../../hooks/customHooks/useExpenseReportState'
import LineAreaChartReport from '../../components/LineAreaChartReport'
import StackedChartReport from '../../components/StackedChartReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import PieChartReport from '../../components/PieChartReport'
import { formatWithThousandSeparator } from '../../utils'
import TableReport from '../../components/TableReport'
import SelectComponent from '../../components/Select'

import styles from './styles'

const useStyles = makeStyles(styles)
const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const ExpenseReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()

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
      chartTransactionsList,
      categorizedAndUncategorizedList,
      percentExpenseList,
      totalCategorizedList
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

  useEffect(() => {
    setShowElectionRadio('oneElection')
  }, [])

  const tableData = chartTransactionsList.map(firstObj => ({
    ...percentExpenseList.find(secondObj => secondObj.name === firstObj.name),
    ...firstObj
  }))

  const columns = [
    {
      field: 'txId',
      headerName: t('tableHeader2', { ns: 'expenseRoute' }),
      hide: !tableData[0]?.txId,
      cellClassName: classes.links,
      renderCell: param => (
        <Tooltip title={param.value}>
          <a href={`https://bloks.io/transaction/${param.value}`}>
            {param.value.slice(0, 8)}
          </a>
        </Tooltip>
      ),
      ...rowsCenter
    },
    {
      field: 'name',
      headerName: tableData[0]?.level
        ? t('tableHeader1', { ns: 'expenseRoute' })
        : t('tableElectionHeader', { ns: 'expenseRoute' }),
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
      headerName: t('tableHeader3', { ns: 'expenseRoute' }),
      hide: !tableData[0]?.level,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'category',
      headerName: t('tableHeader11', { ns: 'expenseRoute' }),
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
      headerName: t('tableHeader6', { ns: 'expenseRoute' }),
      hide: !tableData[0]?.date,
      ...rowsCenter
    },
    {
      field: 'EOS_CATEGORIZED',
      headerName: t('tableHeader7', { ns: 'expenseRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    },
    {
      field: 'EOS_UNCATEGORIZED',
      headerName: t('tableHeader8', { ns: 'expenseRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    },
    {
      field: 'USD_CATEGORIZED',
      headerName: t('tableHeader9', { ns: 'expenseRoute' }),
      type: 'number',
      hide:
        showDelegateRadio === 'oneDelegate' &&
        showElectionRadio === 'oneElection',
      ...rowsCenter
    },
    {
      field: 'USD_UNCATEGORIZED',
      headerName: t('tableHeader10', { ns: 'expenseRoute' }),
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
              {t('title', { ns: 'expenseRoute' })}
            </Typography>
          </div>
        </div>
        <TreasuryBalance />
      </div>
      <div className={classes.subTitle}>
        <Typography variant="span">
          {t('subTitle', { ns: 'expenseRoute' })}
        </Typography>
        <br />
        <label>{t('textInformation', { ns: 'expenseRoute' })}</label>
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
              values={expenseByAllDelegatesList.map(
                data => data.delegate_payer
              )}
              disable={showDelegateRadio === 'allDelegates'}
              actualValue={delegateSelect}
            />
          </>
        </div>
      </div>
      <div>
        <LineAreaChartReport
          data={chartTransactionsList}
          coinType={typeCurrencySelect}
          showEosRate={showEosRateSwitch}
          keyTranslation={'titleComposeChartDelegate'}
          pathTranslation={'expenseRoute'}
        />
      </div>

      <div className={classes.chartContainer}>
        <StackedChartReport
          data={categorizedAndUncategorizedList}
          firstCategory={'CATEGORIZED'}
          secondCategory={'UNCATEGORIZED'}
          typeCurrency={typeCurrencySelect}
          showEosRate={showEosRateSwitch}
          keyTranslation={'titleStackedChartDelegate'}
          pathTranslation={'expenseRoute'}
        />

        <PieChartReport
          data={totalCategorizedList}
          coinType={`${typeCurrencySelect}`}
          keyTranslation={'titlePieChartDelegate'}
          pathTranslation={'expenseRoute'}
        />
      </div>
      <div className={classes.tableContainer}>
        <div className={classes.subTitle}>
          <div id="id-table-container">
            <TableReport columns={columns} dataPercent={tableData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ExpenseReport)
