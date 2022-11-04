import React, { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import {
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import useExpenseGeneralReportState from '../../hooks/customHooks/useExpenseGeneralReportState'
import BarChartGeneralReport from '../../components/BarChartGeneralReport'
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
      expenseByElectionsList,
      electionsByYearList,
      percentExpenseList,
      delegatesList,
      categoryList,
      electionRoundSelect,
      electionYearSelect,
      showElectionRadio
    },
    {
      setElectionRoundSelect,
      setElectionYearSelect,
      getListElectionYears,
      setShowElectionRadio
    }
  ] = useExpenseGeneralReportState()

  useEffect(() => {
    setShowElectionRadio('allElections')
  }, [])

  console.log(categoryList)

  const tableData =
    showElectionRadio === 'allElections'
      ? expenseByElectionsList.map(firstObj => ({
          ...percentExpenseList.find(
            secondObj => secondObj.name === firstObj.election
          ),
          ...firstObj
        }))
      : delegatesList.map(firstObj => ({
          ...percentExpenseList.find(
            secondObj => secondObj.name === firstObj.name
          ),
          ...firstObj
        }))

  const columns = [
    {
      field: 'election',
      hide: !tableData[0]?.election,
      headerName: t('tableElectionHeader', { ns: 'expenseRoute' }),
      cellClassName: classes.links,
      ...rowsCenter
    },
    {
      field: 'name',
      hide: !tableData[0]?.color,
      headerName: tableData[0]?.name
        ? t('tableHeader1', { ns: 'expenseRoute' })
        : t('tableElectionHeader', { ns: 'expenseRoute' }),
      cellClassName: classes.links,
      renderCell: param => (
        <a
          className={tableData[0]?.name ? '' : classes.disableLink}
          href={`https://eosauthority.com/account/${param.value}?network=eos`}
        >
          {param.value}
        </a>
      ),
      ...rowsCenter
    },
    {
      field: 'EOS_TOTAL',
      headerName: 'EOS',
      hide: !tableData[0]?.election,
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'USD_TOTAL',
      headerName: 'USD',
      hide: !tableData[0]?.election,
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'EOS_CATEGORIZED_PERCENT',
      headerName: t('tableHeader7', { ns: 'expenseRoute' }),
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'EOS_UNCATEGORIZED_PERCENT',
      headerName: t('tableHeader8', { ns: 'expenseRoute' }),
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'USD_CATEGORIZED_PERCENT',
      headerName: t('tableHeader9', { ns: 'expenseRoute' }),
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'USD_UNCATEGORIZED_PERCENT',
      headerName: t('tableHeader10', { ns: 'expenseRoute' }),
      type: 'number',
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
            </>
          )}
        </div>
      </div>

      <div>
        <BarChartGeneralReport
          data={expenseByElectionsList}
          keyTranslation={'titleAreaChartGeneral1'}
          pathTranslation={'expenseRoute'}
          showLegend={true}
          typeData={'expense'}
        />
      </div>

      <div className={classes.chartContainer}>
        <PieChartReport
          data={delegatesList}
          keyTranslation={'titlePieChartGeneral1'}
          pathTranslation={'expenseRoute'}
          typeData={'expense'}
        />

        <PieChartReport
          data={categoryList}
          keyTranslation={'titlePieChartGeneral2'}
          pathTranslation={'expenseRoute'}
          typeData={'expense'}
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
