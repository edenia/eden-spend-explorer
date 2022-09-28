import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { DataGrid, esES, enUS } from '@mui/x-data-grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Tooltip } from '@mui/material'

import styles from './styles'

const useStyles = makeStyles(styles)
const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const IncomeTable = ({ data, thousandSeparator }) => {
  const classes = useStyles()
  const { t } = useTranslation('incomeRoute')
  const theme = createTheme(t('tableHeader1') === 'Name' ? enUS : esES)
  const columns = [
    {
      field: 'txId',
      headerName: t('tableHeader2'),
      hide: !data[0]?.txId,
      cellClassName: classes.chartLinks,
      renderCell: param => (
        <Tooltip title={param.value}>
          <a
            href={
              param.value.lenght > 60
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
      headerName: data[0]?.level ? t('tableHeader1') : t('tableElectionHeader'),
      cellClassName: classes.chartLinks,
      renderCell: param => (
        <a
          className={data[0]?.level ? '' : classes.disableLink}
          href={`https://eosauthority.com/account/${param.value}?network=eos`}
        >
          {param.value}
        </a>
      ),
      ...rowsCenter
    },
    {
      field: 'level',
      headerName: t('tableHeader3'),
      hide: !data[0]?.level,
      ...rowsCenter
    },
    {
      field: 'EOS',
      headerName: t('tableHeader4'),
      renderCell: param => <>{thousandSeparator(param.value)}</>,
      ...rowsCenter
    },
    {
      field: 'USD',
      headerName: t('tableHeader5'),
      renderCell: param => <>{thousandSeparator(param.value)}</>,
      ...rowsCenter
    },
    {
      field: 'date',
      headerName: t('tableHeader6'),
      hide: !data[0]?.date,
      ...rowsCenter
    }
  ]

  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        sx={{ border: 'none' }}
        rows={data}
        columns={columns}
        autoPageSize
        pagination
        getRowId={row => `${row.name}-${row.txId}`}
      />
    </ThemeProvider>
  )
}
IncomeTable.propTypes = {
  data: PropTypes.array,
  thousandSeparator: PropTypes.func
}

export default memo(IncomeTable)
