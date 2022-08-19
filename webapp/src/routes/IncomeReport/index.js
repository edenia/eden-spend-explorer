import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'

import styles from './styles'

const useStyles = makeStyles(styles)

const selectList = [
  {
    width: 100,
    id: 'coin-select-id',
    labelSelect: 'Coin',
    values: ['EOS', 'USD']
  },
  {
    width: 100,
    id: 'election-select-id',
    labelSelect: 'Election',
    values: [1, 2, 3]
  },
  {
    width: 100,
    id: 'year-select-id',
    labelSelect: 'Year',
    values: [2019, 2020]
  }
]
const SelectComponent = ({ width, labelSelect, id, values }) => {
  return (
    <FormControl sx={{ m: 1, width: width }} size="small">
      <InputLabel>{labelSelect}</InputLabel>
      <Select
        labelId="demo-select-small"
        id={id}
        value={values[0]}
        label={labelSelect}
      >
        {values.map(value => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
SelectComponent.propTypes = {
  width: PropTypes.number,
  labelSelect: PropTypes.string,
  id: PropTypes.string,
  values: PropTypes.array
}

const IncomesChart = ({ data }) => {
  return (
    <>
      <Box display="flex" justifyContent="end"></Box>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          width={1000}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="EOS" barSize={50} fill="#00c2bf" />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

IncomesChart.propTypes = {
  data: PropTypes.array
}

const IncomeReport = () => {
  const [{ currencyBalance, eosRate, transactionsList }] =
    useIncomeReportState()
  const classes = useStyles()

  return (
    <Box>
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              paddingLeft={2}
            >
              <label className={classes.eosBalance}>Incomes by Delegate</label>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="end">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="end"
                className={classes.eosPriceContainer}
              >
                <label className={classes.eosPriceTitle}>
                  Eden Treasury Balance
                </label>
                <label className={classes.eosBalance}>
                  {Number(currencyBalance.split(' ')[0]).toFixed(2)} EOS
                </label>
                <label className={classes.eosBalanceInDollars}>
                  $
                  {(eosRate * Number(currencyBalance.split(' ')[0])).toFixed(2)}{' '}
                  @ ${eosRate.toFixed(2)}/EOS
                </label>
              </Box>{' '}
            </Box>
          </Grid>
        </Grid>
        <Box marginTop={2} paddingLeft={2}>
          Eden delegate disbursements occur monthly and are claimed by the
          delegate from the contract to their personal EOS accounts...
          <br />
          Next disbursement date: June 8, 2022
        </Box>
        <Box display="flex" justifyContent="end">
          <RadioGroup
            name="controlled-radio-buttons-group"
            defaultValue="oneDelegate"
            row
          >
            <FormControlLabel
              control={<Radio size="small" />}
              label="By one delegate"
              value="oneDelegate"
            />
            <FormControlLabel
              control={<Radio size="small" />}
              label="By all delegates"
              value="allDelegate"
            />
          </RadioGroup>
          {selectList.map(data => (
            <SelectComponent {...data} key={data.id} />
          ))}
        </Box>
      </Box>

      <IncomesChart data={transactionsList} />
    </Box>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
