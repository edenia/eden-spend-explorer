import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Spinner } from '@edenia/ui-kit'
import { useTranslation } from 'react-i18next'
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material'

import { CATEGORIES } from '../../constants/income.constants'
import { useSharedState } from '../../context/state.context'
import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'

const useStyles = makeStyles(styles)

const SpendToolFormReport = ({
  loadingSignTransaction,
  handleInputChange,
  handleEosTransfer,
  errorMessage,
  formValues,
  errors
}) => {
  const classes = useStyles()
  const [state] = useSharedState()
  const { t } = useTranslation('spendToolsRoute')

  const { eosRate = 0, delegateBalance } = state.eosTrasuryBalance
  const { to, amount, category, description } = formValues

  const getTotalUSD = () =>
    `Aprox. $${
      isNaN(Number(amount.split(' ')[0]))
        ? 0
        : (Number(amount.split(' ')[0]) * eosRate).toFixed(4)
    } @ $${eosRate.toFixed(2)}/EOS`

  return (
    <form onSubmit={handleEosTransfer}>
      <div className={classes.formContainer}>
        <div className={classes.rowFormContainer}>
          <div className={classes.inputContainer}>
            <InputLabel>{t('toLabel')}</InputLabel>
            <TextField
              name="to"
              type="text"
              value={to}
              onChange={handleInputChange}
              placeholder={t('toInput')}
              error={errors?.to}
              id="outlined-error"
              autoComplete="off"
              fullWidth
            />
          </div>
          <div className={classes.specialInput}>
            <div id="labels-id">
              <label id="amount-id">{t('amountLabel')}</label>
              <label id="available-id">
                {t('availableLabel')}:{' '}
                {formatWithThousandSeparator(delegateBalance)}
              </label>
            </div>
            <TextField
              name="amount"
              type="text"
              value={amount}
              onChange={handleInputChange}
              placeholder="0.0000 EOS"
              fullWidth
              autoComplete="off"
              error={errors?.amount}
              helperText={getTotalUSD()}
              inputProps={{
                pattern: '(([0-9]{1,9}.[0-9]{1,4})|([0-9]{1,9})) [E][O][S]'
              }}
            />
          </div>
        </div>
        <div className={classes.rowFormContainer}>
          <div className={classes.inputContainer}>
            <InputLabel>{t('categoryLabel')}</InputLabel>
            <Select
              name="category"
              type="text"
              value={category}
              onChange={handleInputChange}
              className={classes.selectForm}
              error={errors?.category}
              displayEmpty
              renderValue={
                category !== ''
                  ? undefined
                  : () => (
                      <MenuItem id="placeholder-select">
                        {t('categoryInput')}
                      </MenuItem>
                    )
              }
            >
              {CATEGORIES.map(category => (
                <MenuItem key={`${category}-categorize`} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.inputContainer}>
            <InputLabel>{t('descriptionLabel')}</InputLabel>
            <TextField
              name="description"
              type="text"
              value={description}
              onChange={handleInputChange}
              placeholder={t('descriptionInput')}
              fullWidth
              error={errors?.description}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          disabled={loadingSignTransaction || eosRate === 0}
          type="submit"
        >
          {loadingSignTransaction ? (
            <Spinner size={30} />
          ) : (
            <span className={classes.labelButtonTransfer}>
              {t('transferButton')}
            </span>
          )}
        </Button>
      </div>
      <div className={classes.dangerText}>
        <small>{errorMessage}</small>
      </div>
    </form>
  )
}

SpendToolFormReport.propTypes = {
  loadingSignTransaction: PropTypes.bool,
  formValues: PropTypes.object,
  errorMessage: PropTypes.string,
  errors: PropTypes.object,
  handleInputChange: PropTypes.func,
  handleEosTransfer: PropTypes.func
}

export default memo(SpendToolFormReport)
