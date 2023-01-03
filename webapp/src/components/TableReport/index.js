import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  DataGrid,
  esES,
  enUS,
  GridToolbarContainer,
  GridToolbarExport
} from '@mui/x-data-grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

const TableReport = ({ columns, dataPercent }) => {
  const classes = useStyles()
  const { t } = useTranslation('generalForm')
  const [pagePaginationSize, setPagePaginationSize] = useState(5)
  const theme = createTheme(t('date') === 'Date' ? enUS : esES)

  return (
    <div className={classes.tableContainer}>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={dataPercent}
          loading={!dataPercent[0]}
          columns={columns}
          pageSize={pagePaginationSize}
          onPageSizeChange={newPageSize => setPagePaginationSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          components={{ Toolbar: CustomToolbar }}
          getRowId={row =>
            `${row.name}-${row.id}-${row.color}-${row.EOS}-${row.election}`
          }
        />
      </ThemeProvider>
    </div>
  )
}

TableReport.propTypes = {
  columns: PropTypes.array,
  dataPercent: PropTypes.array
}

export default memo(TableReport)
