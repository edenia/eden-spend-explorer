import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'
import { Typography } from '@mui/material'
import TableReport from '../../components/TableReport'

const useStyles = makeStyles(styles)
const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const IncomeTableReport = ({ tableData, showElectionRadio }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const columns = [
    {
      field: tableData[0]?.name ? 'name' : 'election',
      headerName: tableData[0]?.name
        ? t('tableHeader1', { ns: 'incomeRoute' })
        : t('tableElectionHeader', { ns: 'incomeRoute' }),
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
      field: tableData[0]?.election ? 'EOS_TOTAL' : 'EOS_CLAIMED',
      headerName: 'EOS',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: tableData[0]?.election ? 'USD_TOTAL' : 'USD_CLAIMED',
      headerName: 'USD',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'EOS_CLAIMED_PERCENT',
      headerName: t('tableHeader7', { ns: 'incomeRoute' }),
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'EOS_UNCLAIMED_PERCENT',
      headerName: t('tableHeader8', { ns: 'incomeRoute' }),
      type: 'number',
      ...rowsCenter
    }
  ]

  return (
    <div className={classes.tableContainer}>
      <div className={classes.title}>
        <Typography variant="span">
          {showElectionRadio === 'allElections'
            ? t('titleTable2', { ns: 'incomeRoute' })
            : t('titleTable', { ns: 'incomeRoute' })}
        </Typography>
        <div id="id-table-container">
          <TableReport columns={columns} dataPercent={tableData} />
        </div>
      </div>
    </div>
  )
}

IncomeTableReport.propTypes = {
  tableData: PropTypes.array,
  showElectionRadio: PropTypes.string
}
export default memo(IncomeTableReport)
