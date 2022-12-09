import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const SelectComponent = ({
  labelSelect,
  values,
  onChangeFunction,
  actualValue,
  width = 80,
  size = 'normal'
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  if (!values[0]) return null

  const selectValue = value => {
    if (labelSelect === t('textElectionSelect', { ns: 'generalForm' }))
      return Number(value) + 1
    else if (value === 'All') return t('AllSelectYear', { ns: 'generalForm' })
    else return value
  }

  return (
    <div className={classes.selectContainer}>
      <FormControl sx={{ width: width }} size={size}>
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
    </div>
  )
}

SelectComponent.propTypes = {
  labelSelect: PropTypes.string,
  values: PropTypes.array,
  onChangeFunction: PropTypes.func,
  actualValue: PropTypes.any,
  width: PropTypes.number,
  size: PropTypes.string
}

export default memo(SelectComponent)
