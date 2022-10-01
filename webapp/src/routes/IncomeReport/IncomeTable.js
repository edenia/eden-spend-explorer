import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip
} from '@mui/material'

import styles from './styles'

const useStyles = makeStyles(styles)

const IncomeTable = ({ data, thousandSeparator, dataPercent }) => {
  const classes = useStyles()

  const { t } = useTranslation('incomeRoute')

  return (
    <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {data[0]?.txId && <TableCell>TX</TableCell>}
            {
              <TableCell>
                {data[0]?.level ? t('tableHeader1') : t('tableElectionHeader')}
              </TableCell>
            }
            {data[0]?.level && <TableCell>{t('tableHeader3')}</TableCell>}
            <TableCell>{t('tableHeader4')}</TableCell>
            <TableCell>{t('tableHeader5')}</TableCell>
            {data[0]?.date && <TableCell>{t('tableHeader6')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(
            (
              {
                name,
                txId = null,
                level = null,
                EOS,
                USD,
                date = null,
                category = null
              },
              index
            ) => (
              <TableRow key={`table-${name}-${index}`}>
                <TableCell>
                  <strong>{index + 1}</strong>
                </TableCell>
                {txId && (
                  <TableCell className={classes.chartLinks}>
                    {category === 'unclaimed' ? (
                      <Tooltip title={txId}>
                        <a
                          href={`https://bloks.io/account/genesis.eden?loadContract=true&tab=Tables&table=distaccount&account=genesis.eden&scope=&limit=100&lower_bound=${txId}&upper_bound=${txId}`}
                        >
                          {txId.slice(0, 9)}
                        </a>
                      </Tooltip>
                    ) : (
                      <Tooltip title={txId}>
                        <a href={`https://bloks.io/transaction/${txId}`}>
                          {txId.slice(0, 9)}
                        </a>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
                <TableCell className={classes.chartLinks}>
                  <a
                    className={level ? '' : classes.disableLink}
                    href={`https://eosauthority.com/account/${name}?network=eos`}
                  >
                    {name}
                  </a>
                </TableCell>
                {level && <TableCell>{level}</TableCell>}
                <TableCell>{thousandSeparator(EOS)}</TableCell>
                <TableCell>{thousandSeparator(USD)}</TableCell>
                {date && <TableCell>{date}</TableCell>}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

IncomeTable.propTypes = {
  data: PropTypes.array,
  thousandSeparator: PropTypes.func,
  dataPercent: PropTypes.array
}

export default memo(IncomeTable)
