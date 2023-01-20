import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import InputLabel from '@mui/material/InputLabel'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@edenia/ui-kit'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'
import { CATEGORIES } from '../../constants/income.constants'
import { useSharedState } from '../../context/state.context'

import styles from './styles'

const useStyles = makeStyles(styles)
let firstConcat = true

const SpendToolModalReport = ({
  openModal,
  handleCloseModal,
  modalData,
  formValuesModal,
  handleInputChangeModal,
  errorMessage,
  handleRecategorizeTx,
  loadingSignTransaction,
  errorsModal
}) => {
  const classes = useStyles()
  const [state] = useSharedState()
  const { t } = useTranslation('spendToolsRoute')
  let { newCategory, newDescription } = formValuesModal

  useEffect(() => {
    if (newCategory) {
      handleInputChangeModal({
        target: { name: 'newDescription', value: modalData?.description }
      })
    }
  }, [newCategory])

  if (firstConcat && modalData?.description) {
    newDescription = newDescription.concat(modalData?.description)
    firstConcat = false
  }

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <div className={classes.modalDimentions}>
        <IconButton onClick={handleCloseModal} id="close-modal-button-id">
          <img src={`${process.env.PUBLIC_URL}/icons/close.svg`} />
        </IconButton>
        <div>
          <span className={classes.titleModal}>{t('modalTitle')}</span>
        </div>
        <div className={classes.textModalContainer}>
          <span>{t('modalAbout')}</span>
        </div>
        <div>
          <strong>{t('transactionInfo')} </strong>
          <Tooltip title={modalData?.txid || ''}>
            <label>{modalData?.txid?.slice(0, 8)}...</label>
          </Tooltip>
          <br />
          <strong>{t('blockTime')} </strong>{' '}
          {new Date(modalData?.date?.split('T')[0]).toLocaleDateString()}
          <br />
          <strong>{t('action')} </strong> transfer <strong>{t('data')} </strong>
          {state.user?.accountName} {'->'} {modalData?.recipient}
          <br />
          <strong>{t('quantity')} </strong>
          {formatWithThousandSeparator(modalData?.amount, 4)}
          /EOS
          <br />
          <strong>Memo: </strong> {modalData?.description || t('memo')}
        </div>
        <form onSubmit={handleRecategorizeTx}>
          <div className={classes.formModalContainer}>
            <div className={classes.rowFormContainer}>
              <div className={classes.inputContainer}>
                <InputLabel>{t('categoryLabel')}</InputLabel>
                <Select
                  name="newCategory"
                  value={newCategory}
                  onChange={handleInputChangeModal}
                  type="text"
                  className={classes.selectForm}
                  error={errorsModal?.newCategory}
                >
                  {CATEGORIES.map(category => (
                    <MenuItem key={`${category}-transfer`} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className={classes.inputContainer}>
                <InputLabel>{t('descriptionLabel')}</InputLabel>
                <TextField
                  name="newDescription"
                  value={newDescription}
                  onChange={handleInputChangeModal}
                  type="text"
                  error={errorsModal?.newDescription}
                  fullWidth
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <br />
            <Button disabled={loadingSignTransaction} type="submit">
              {loadingSignTransaction ? (
                <Spinner size={30} />
              ) : (
                <span className={classes.labelButtonTransfer}>
                  {t('appendButton')}
                </span>
              )}
            </Button>
          </div>
          <div className={classes.dangerText}>
            <small>{errorMessage}</small>
          </div>
        </form>
      </div>
    </Modal>
  )
}

SpendToolModalReport.propTypes = {
  openModal: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  modalData: PropTypes.object,
  formValuesModal: PropTypes.object,
  handleInputChangeModal: PropTypes.func,
  errorMessage: PropTypes.string,
  handleRecategorizeTx: PropTypes.func,
  loadingSignTransaction: PropTypes.bool,
  errorsModal: PropTypes.object
}

export default memo(SpendToolModalReport)
