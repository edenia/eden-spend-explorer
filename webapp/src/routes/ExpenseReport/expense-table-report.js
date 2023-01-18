import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import TableReport from '../../components/TableReport'
import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'

const useStyles = makeStyles(styles)
const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const ExpenseTableReport = ({ tableData, showElectionRadio }) => {
  const classes = useStyles()
  const { t } = useTranslation()

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
  )
}

ExpenseTableReport.propTypes = {
  tableData: PropTypes.array,
  showElectionRadio: PropTypes.string
}
export default memo(ExpenseTableReport)
