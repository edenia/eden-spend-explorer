import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const SelectComponent = ({
  labelSelect,
  values,
  onChangeFunction,
  actualValue,
  disable
}) => {
  const { t } = useTranslation()

  if (disable || !values[0]) return null

  const selectValue = value => {
    if (labelSelect === t('textElectionSelect', { ns: 'generalForm' }))
      return Number(value) + 1
    else if (value === 'All') return t('AllSelectYear', { ns: 'generalForm' })
    else return value
  }

  return (
    <FormControl sx={{ m: 1, width: 100 }} size="small">
      <InputLabel>{labelSelect}</InputLabel>
      <Select
        labelId="demo-select-small"
        id="select-id"
        value={actualValue}
        label={labelSelect}
        onChange={({ target }) => onChangeFunction(target.value)}
      >
        {values.map(value => (
          <MenuItem key={value} value={value}>
            {selectValue(value)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

SelectComponent.propTypes = {
  labelSelect: PropTypes.string,
  values: PropTypes.array,
  onChangeFunction: PropTypes.func,
  actualValue: PropTypes.any,
  disable: PropTypes.bool
}

export default memo(SelectComponent)
