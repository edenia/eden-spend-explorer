import React, { memo } from 'react'
import { Divider, IconButton, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import styles from './styles'
import TableReport from '../../components/TableReport'
import { formatWithThousandSeparator } from '../../utils'

const useStyles = makeStyles(styles)
const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

export const SpendToolTableRerport = ({
  handleOpenModal,
  transactionsList
}) => {
  const classes = useStyles()
  const { t } = useTranslation('spendToolsRoute')

  const columns = [
    {
      field: 'id',
      hide: true
    },
    {
      field: 'txid',
      headerName: t('headerTable1'),
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
      field: 'date',
      headerName: t('headerTable2'),
      type: 'date',
      renderCell: param => (
        <>{new Date(param.value.split('T')[0]).toLocaleDateString()}</>
      ),
      ...rowsCenter
    },
    {
      field: 'amount',
      headerName: t('headerTable3'),
      type: 'number',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 4)}</>,
      ...rowsCenter
    },
    {
      field: 'recipient',
      headerName: t('headerTable4'),
      renderCell: param => (
        <Tooltip title={param.value}>
          <div>{param.value}</div>
        </Tooltip>
      ),
      ...rowsCenter
    },
    {
      field: 'description',
      headerName: t('headerTable5'),
      renderCell: param => (
        <Tooltip title={param.value}>
          <div>{param.value.length === 0 ? 'Without memo' : param.value}</div>
        </Tooltip>
      ),
      ...rowsCenter
    },
    {
      field: 'category',
      headerName: t('headerTable6'),
      renderCell: param => (
        <Tooltip title={param.value}>
          <div>{param.value}</div>
        </Tooltip>
      ),
      ...rowsCenter
    },
    {
      field: 'action',
      headerName: t('headerTable7'),
      sortable: false,
      renderCell: params => {
        const onClick = () => {
          handleOpenModal(params)
        }
        return (
          <Tooltip title="Add category">
            <IconButton onClick={onClick}>
              <img src={`${process.env.PUBLIC_URL}/icons/add_circle.svg`} />
            </IconButton>
          </Tooltip>
        )
      },
      ...rowsCenter
    }
  ]

  return (
    <div className={classes.tableContainer}>
      <Divider />
      <div className={classes.titleTable}>{t('titleTable')}</div>
      <div id="id-table-container">
        <TableReport columns={columns} dataPercent={transactionsList} />{' '}
      </div>
    </div>
  )
}

SpendToolTableRerport.propTypes = {
  handleOpenModal: PropTypes.func,
  transactionsList: PropTypes.array
}

export default memo(SpendToolTableRerport)
