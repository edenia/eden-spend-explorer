import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'

const IncomeTable = ({ data, thousandSeparator }) => {
  const { t } = useTranslation('incomeRoute')
  return (
    <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {
              <TableCell>
                {data[0]?.level ? t('tableHeader1') : t('tableElectionHeader')}
              </TableCell>
            }
            {data[0]?.level && <TableCell>{t('tableHeader2')}</TableCell>}
            <TableCell>{t('tableHeader3')}</TableCell>
            <TableCell>{t('tableHeader4')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(({ name, level = null, EOS, USD }, index) => (
            <TableRow key={`table-${name}`}>
              <TableCell>
                <strong>{index + 1}</strong>
              </TableCell>
              <TableCell>{name}</TableCell>
              {level && <TableCell>{level}</TableCell>}
              <TableCell>{thousandSeparator(EOS)}</TableCell>
              <TableCell>{thousandSeparator(USD)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
IncomeTable.propTypes = {
  data: PropTypes.array,
  thousandSeparator: PropTypes.func
}

export default memo(IncomeTable)
