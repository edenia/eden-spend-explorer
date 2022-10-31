import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import InputLabel from '@mui/material/InputLabel'
import { IconButton, MenuItem, Modal, TextField, Tooltip } from '@mui/material'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'
import useSpendTools from '../../hooks/customHooks/useSpendToolsState'
import { CATEGORIES } from '../../constants/income.constants'
import { useSharedState } from '../../context/state.context'
import TableReport from '../../components/TableReport'

import styles from './styles'

const useStyles = makeStyles(styles)

const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const SpendTools = () => {
  const classes = useStyles()
  const [state] = useSharedState()
  const { t } = useTranslation('spendToolsRoute')
  const [
    {
      transactionsList,
      formValues,
      errors,
      openModal,
      formValuesModal,
      errorMessage,
      modalData
    },
    {
      handleInputChange,
      handleInputChangeModal,
      validateForm,
      handleCloseModal,
      handleOpenModal,
      executeAction
    }
  ] = useSpendTools()

  const { to, amount, category, description } = formValues
  const { newCategory, newDescription } = formValuesModal

  const handleEosTransfer = async e => {
    e.preventDefault()

    if (openModal) {
      if (Object.keys(validateForm(formValuesModal)).length > 0) return

      const dataAction = {
        account: state.user?.accountName,
        new_memo: `eden_expense:${newCategory}/${newDescription}`,
        tx_id: modalData?.txid
      }

      await executeAction(dataAction, 'edenexplorer', 'categorize', state)
    } else {
      if (Object.keys(validateForm(formValues)).length > 0) return

      const dataAction = {
        from: state.user?.accountName,
        to,
        quantity: amount,
        memo: `eden_spend:${category}/${description}`
      }

      await executeAction(dataAction, 'eosio.token', 'transfer', state)
    }
  }

  const columns = [
    {
      field: 'txid',
      headerName: t('headerTable1'),
      cellClassName: classes.links,
      renderCell: param => (
        <Tooltip title={param.value}>
          <a href={`https://bloks.io/transaction/${param.value}`}>
            {param.value.slice(0, 8)}
          </a>
        </Tooltip>
      ),
      ...rowsCenter
    },
    {
      field: 'date',
      headerName: t('headerTable2'),
      renderCell: param => (
        <>{new Date(param.value.split('T')[0]).toLocaleDateString()}</>
      ),
      ...rowsCenter
    },
    {
      field: 'amount',
      headerName: t('headerTable3'),
      type: 'number',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 4)}</>,
      ...rowsCenter
    },
    {
      field: 'recipient',
      headerName: t('headerTable4'),
      ...rowsCenter
    },
    {
      field: 'category',
      headerName: t('headerTable5'),
      renderCell: param => (
        <>{param.value === 'uncategorized' ? 'No' : 'Yes'}</>
      ),
      ...rowsCenter
    },
    {
      field: 'action',
      headerName: t('headerTable6'),
      sortable: false,
      renderCell: params => {
        const onClick = () => {
          handleOpenModal(params)
        }
        return (
          <Tooltip title="Add category">
            <IconButton onClick={onClick}>
              <img src={`${process.env.PUBLIC_URL}/icons/add_circle.svg`} />
            </IconButton>
          </Tooltip>
        )
      },
      ...rowsCenter
    }
  ]

  return (
    <div className={classes.root}>
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
            <strong>{t('action')} </strong> transfer{' '}
            <strong>{t('data')} </strong>
            {state.user?.accountName} {'->'} {modalData?.recipient}
            <br />
            <strong>{t('quantity')} </strong>
            {formatWithThousandSeparator(modalData?.amount, 4)}
            EOS
            <br />
            <strong>Memo: </strong> {modalData?.description || t('memo')}
          </div>
          <form onSubmit={handleEosTransfer}>
            <div className={classes.formModalContainer}>
              <div className={classes.rowFormContainer}>
                <div className={classes.inputContainer}>
                  <InputLabel>{t('categoryInput')}</InputLabel>
                  <Select
                    name="newCategory"
                    value={newCategory}
                    onChange={handleInputChangeModal}
                    type="text"
                    className={classes.selectForm}
                    error={errors?.newCategory}
                  >
                    {CATEGORIES.map(category => (
                      <MenuItem key={`${category}-transfer`} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.inputContainer}>
                  <InputLabel>{t('descriptionInput')}</InputLabel>
                  <TextField
                    name="newDescription"
                    value={newDescription}
                    onChange={handleInputChangeModal}
                    type="text"
                    error={errors?.newDescription}
                    fullWidth
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <br />
              <Button type="submit">
                <span className={classes.labelButtonTransfer}>
                  {t('appendButton')}
                </span>
              </Button>
            </div>
            <div className={classes.dangerText}>
              <small>{errorMessage}</small>
            </div>
          </form>
        </div>
      </Modal>
      <div>{t('viewAbout')}</div>
      <div className={classes.toolInformation}>{t('transferInformation')}</div>
      <form onSubmit={handleEosTransfer}>
        <div className={classes.formContainer}>
          <div className={classes.rowFormContainer}>
            <div className={classes.inputContainer}>
              <InputLabel>{t('toInput')}</InputLabel>
              <TextField
                name="to"
                type="text"
                value={to}
                onChange={handleInputChange}
                placeholder="Enter account name..."
                error={errors?.to}
                id="outlined-error"
                autoComplete="off"
                fullWidth
              />
            </div>
            <div className={classes.specialInput}>
              <div id="labels-id">
                <label id="amount-id">{t('amountInput')}</label>
                <label id="available-id">Available: 1,250.54 EOS</label>
              </div>
              <TextField
                name="amount"
                type="text"
                value={amount}
                onChange={handleInputChange}
                placeholder="0.0000 SYMBOL"
                fullWidth
                autoComplete="off"
                error={errors?.amount}
              />
            </div>
          </div>
          <div className={classes.rowFormContainer}>
            <div className={classes.inputContainer}>
              <InputLabel>{t('categoryInput')}</InputLabel>
              <Select
                name="category"
                type="text"
                value={category}
                onChange={handleInputChange}
                className={classes.selectForm}
                error={errors?.category}
              >
                {CATEGORIES.map(category => (
                  <MenuItem key={`${category}-categorize`} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.inputContainer}>
              <InputLabel>{t('descriptionInput')}</InputLabel>
              <TextField
                name="description"
                type="text"
                value={description}
                onChange={handleInputChange}
                placeholder="Add a description"
                fullWidth
                error={errors?.description}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button type="submit">
            <span className={classes.labelButtonTransfer}>
              {t('transferButton')}
            </span>
          </Button>
        </div>
        <div className={classes.dangerText}>
          <small>{errorMessage}</small>
        </div>
      </form>
      <div className={classes.divShadow}>
        <div className={classes.tableContainer}>
          <div className={classes.titleTable}>Tokens Sent By Your Account</div>
          <div id="id-table-container">
            <TableReport columns={columns} dataPercent={transactionsList} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SpendTools)
