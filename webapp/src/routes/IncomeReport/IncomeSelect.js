import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const IncomeSelect = ({
  labelSelect,
  values,
  onChangeFunction,
  actualValue,
  disable
}) => {
  if (disable) return null
  else {
    return (
      <FormControl sx={{ m: 1, width: 100 }} size="small">
        <InputLabel>{labelSelect}</InputLabel>
        <Select
          labelId="demo-select-small"
          id="select-id"
          value={actualValue || ''}
          label={labelSelect}
          onChange={({ target }) => onChangeFunction(target.value)}
          disabled={disable || !values[0]}
        >
          {values[0] ? (
            values.map(value => (
              <MenuItem key={value} value={value}>
                {labelSelect === 'Election' ? Number(value) + 1 : value}
              </MenuItem>
            ))
          ) : (
            <MenuItem value=""></MenuItem>
          )}
        </Select>
      </FormControl>
    )
  }
}
IncomeSelect.propTypes = {
  labelSelect: PropTypes.string,
  values: PropTypes.array,
  onChangeFunction: PropTypes.func,
  actualValue: PropTypes.any,
  disable: PropTypes.bool
}

export default memo(IncomeSelect)
