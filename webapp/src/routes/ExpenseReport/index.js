import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import useExpenseReportState from '../../hooks/customHooks/useExpenseReportState'
import TreasuryBalance from '../../components/TreasuryBalance'
import BarChartReport from '../../components/BarChartReport'
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
      electionsList,
      percentExpenseList,
      delegatesList,
      categoryList,
      electionRoundSelect,
      showElectionRadio
    },
    { setElectionRoundSelect, setShowElectionRadio }
  ] = useExpenseReportState()

  const tableData =
    showElectionRadio === 'allElections'
      ? expenseByElectionsList.map(firstObj => ({
          ...percentExpenseList.find(
            secondObj => secondObj.name === firstObj.election
          ),
          ...firstObj
        }))
      : delegatesList

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
          href={`https://eosdetective.io/network/transfers?accounts=${param.value}&time_min=1661975129190&time_max=1669751129190&excludedAccounts=&excludedCategories=system`}
        >
          {param.value}
        </a>
      ),
      ...rowsCenter
    },
    {
      field: tableData[0]?.election ? 'EOS_TOTAL' : 'EOS_CATEGORIZED',
      headerName: 'EOS',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: tableData[0]?.election ? 'USD_TOTAL' : 'USD_CATEGORIZED',
      headerName: 'USD',
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
    }
  ]

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
      </div>
      <BarChartReport
        data={expenseByElectionsList}
        keyTranslation={'titleBarChart'}
        pathTranslation={'expenseRoute'}
        showLegend={true}
        typeData={'expense'}
      />
      <Divider variant="middle" />
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
        {showElectionRadio === 'oneElection' && (
          <div id="id-radio-election-container">
            <SelectComponent
              onChangeFunction={setElectionRoundSelect}
              labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
              values={electionsList.map(data => `${data.election}`)}
              actualValue={electionRoundSelect}
              size="small"
            />
          </div>
        )}
      </div>
      <div className={classes.chartContainer}>
        <div className={classes.pieChartContainer}>
          <PieChartReport
            data={categoryList}
            keyTranslation={'titlePieChart1'}
            pathTranslation={'expenseRoute'}
            typeData={'expense'}
          />
        </div>
        <div className={classes.dividerLine} />
        <div className={classes.pieChartContainer}>
          <PieChartReport
            data={delegatesList}
            keyTranslation={'titlePieChart2'}
            pathTranslation={'expenseRoute'}
            typeData={'expense'}
          />
        </div>
      </div>
      <Divider variant="middle" />
      <div className={classes.tableContainer}>
        <div className={classes.title}>
          <Typography variant="span">
            {showElectionRadio === 'allElections'
              ? t('titleTable2', { ns: 'expenseRoute' })
              : t('titleTable', { ns: 'expenseRoute' })}
          </Typography>
          <div id="id-table-container">
            <TableReport columns={columns} dataPercent={tableData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ExpenseReport)
