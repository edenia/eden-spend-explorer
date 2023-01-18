import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material'

const RadioFilter = ({
  setValue,
  value1,
  value2,
  label1,
  label2,
  defaultValue
}) => {
  return (
    <FormControl>
      <RadioGroup
        name="election-radio-buttons-group"
        row
        onChange={({ target }) => setValue(target.value)}
        value={defaultValue}
      >
        <FormControlLabel
          control={<Radio size="small" />}
          label={label1}
          value={value1}
        />
        <FormControlLabel
          control={<Radio size="small" />}
          label={label2}
          value={value2}
        />
      </RadioGroup>
    </FormControl>
  )
}

RadioFilter.propTypes = {
  setValue: PropTypes.func,
  value1: PropTypes.string,
  value2: PropTypes.string,
  label1: PropTypes.string,
  label2: PropTypes.string,
  defaultValue: PropTypes.string
}
export default memo(RadioFilter)
