import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { DataGrid, esES, enUS } from '@mui/x-data-grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const TableReport = ({ columns, dataPercent }) => {
  const { t } = useTranslation()
  const [pagePaginationSize, setPagePaginationSize] = useState(5)
  const theme = createTheme(
    t('tableHeader1', { ns: 'incomeRoute' }) === 'Name' ? enUS : esES
  )

  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        sx={{ border: 'none' }}
        rows={dataPercent}
        loading={!dataPercent[0]}
        columns={columns}
        pageSize={pagePaginationSize}
        onPageSizeChange={newPageSize => setPagePaginationSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        getRowId={row => `${row.name}-${row.txId}-${row.color}-${row.EOS}`}
      />
    </ThemeProvider>
  )
}

TableReport.propTypes = {
  columns: PropTypes.array,
  dataPercent: PropTypes.array
}

export default memo(TableReport)