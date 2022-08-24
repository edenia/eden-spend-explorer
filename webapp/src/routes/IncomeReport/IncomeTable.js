import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material'

const IncomeTable = ({ data }) => {
  const { t } = useTranslation('incomeRoute')
  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t('tableHeader1')}</TableCell>
              <TableCell>{t('tableHeader2')}</TableCell>
              <TableCell>{t('tableHeader3')}</TableCell>
              <TableCell>{t('tableHeader4')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ name, level, EOS, USD }, index) => (
              <TableRow key={`table-${name}`}>
                <TableCell>
                  <strong>{index + 1}</strong>
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{level}</TableCell>
                <TableCell>{EOS.toFixed(2)}</TableCell>
                <TableCell>{USD.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
IncomeTable.propTypes = {
  data: PropTypes.array
}

export default memo(IncomeTable)
