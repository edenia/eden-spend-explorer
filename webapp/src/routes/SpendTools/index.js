import React, { memo } from 'react'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import { IconButton, MenuItem, Modal, TextField, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'

import useSpendTools from '../../hooks/customHooks/useSpendToolsState'
import { useSharedState } from '../../context/state.context'
import TableReport from '../../components/TableReport'
import styles from './styles'

const useStyles = makeStyles(styles)

const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const SpendTools = () => {
  const classes = useStyles()
  const [state] = useSharedState()

  const [
    { transactionsList, formValues, errors, openModal, formValuesModal },
    {
      handleInputChange,
      reset,
      validateForm,
      handleCloseModal,
      handleOpenModal,
      resetModal,
      handleInputChangeModal
    }
  ] = useSpendTools()

  const { to, amount, category, description } = formValues
  const { newCategory, newDescription } = formValuesModal

  const handleEosTransfer = async e => {
    e.preventDefault()

    if (openModal) {
      if (Object.keys(validateForm(formValuesModal)).length > 0) return

      const transaction = {
        actions: [
          {
            authorization: [
              {
                actor: state.user?.accountName,
                permission: 'active'
              }
            ],
            account: 'edenexplorer',
            name: 'categorize',
            data: {
              account: state.user?.accountName,
              new_memo: `eden_expense:${newCategory}/${newDescription}`,
              tx_id:
                '69a1a965830582e7297cda011d7681235f759f23991e95e7d2017e47f14bd9d2'
            }
          }
        ]
      }

      const result = await state.ual.activeUser.signTransaction(transaction, {
        broadcast: true
      })

      console.log(result)

      resetModal()
    } else {
      if (Object.keys(validateForm(formValues)).length > 0) return
      console.log(formValues)
      reset()
    }

    reset()
  }

  const columns = [
    {
      field: 'txid',
      headerName: 'TX HASH',
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
      headerName: 'BLOCK TIME',
      ...rowsCenter
    },
    {
      field: 'amount',
      headerName: 'AMOUNT',
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'recipient',
      headerName: 'SENT TO',
      ...rowsCenter
    },
    {
      field: 'description',
      headerName: 'MEMO',
      ...rowsCenter
    },
    {
      field: 'action',
      headerName: 'APPEND',
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
          <IconButton
            onClick={handleCloseModal}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <img src={`${process.env.PUBLIC_URL}/icons/close.svg`} />
          </IconButton>
          <div>
            <span className={classes.titleModal}>Append Memo</span>
          </div>
          <div
            style={{
              marginTop: '24px',
              fontSize: '16px',
              lineHeight: 1.25,
              letterSpacing: '-0.4px',
              color: 'rgba(0, 0, 0, 0.87)'
            }}
          >
            <span>
              A set of instructions to help users. Ut eget massa sed metus
              pellentesque vestibulum ut at enim. Curabitur varius nisi augue.
            </span>
          </div>
          <div style={{ marginTop: '36px' }}>
            <span>
              <strong>Transaction: </strong> Transaction number
            </span>
            <br />
            <span>
              <strong>Block Time: </strong> Date
            </span>
            <br />
            <span>
              <strong>Action: </strong>el action <strong>Data: </strong>
              {'test ->'}
              test 100EOS
            </span>
            <br />
            <span>
              <strong>Memo: </strong> The memo here
            </span>
          </div>
          <form onSubmit={handleEosTransfer}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '32px'
              }}
            >
              <div className={classes.rowFormContainer}>
                <div className={classes.inputContainer}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="newCategory"
                    value={newCategory}
                    onChange={handleInputChangeModal}
                    type="text"
                    className={classes.selectForm}
                    error={errors?.newCategory}
                  >
                    <MenuItem value="Development">Development</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                  </Select>
                </div>
                <div className={classes.inputContainer}>
                  <InputLabel>Description</InputLabel>
                  <TextField
                    name="newDescription"
                    value={newDescription}
                    onChange={handleInputChangeModal}
                    type="text"
                    error={errors?.newDescription}
                    placeholder="Add a description"
                    fullWidth
                  />
                </div>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <br />
              <Button type="submit">
                <span className={classes.labelButtonTransfer}>Append Memo</span>
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <div>A set of tools that will help you perform new transactions with</div>
      <div className={classes.toolInformation}>
        Here you can send tokens related with Eden funds.
      </div>
      <form onSubmit={handleEosTransfer}>
        <div className={classes.formContainer}>
          <div className={classes.rowFormContainer}>
            <div className={classes.inputContainer}>
              <InputLabel>Send Tokens To</InputLabel>
              <TextField
                name="to"
                type="text"
                value={to}
                onChange={handleInputChange}
                placeholder="Enter account name..."
                error={errors?.to}
                id="outlined-error"
                fullWidth
              />
            </div>
            <div className={classes.specialInput}>
              <div id="labels-id">
                <label id="amount-id">Amount</label>
                <label id="available-id">Available: 1,250.54 EOS</label>
              </div>
              <TextField
                name="amount"
                type="text"
                value={amount}
                onChange={handleInputChange}
                placeholder="0.0000 SYMBOL"
                fullWidth
                error={errors?.amount}
              />
            </div>
          </div>
          <div className={classes.rowFormContainer}>
            <div className={classes.inputContainer}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                type="text"
                value={category}
                onChange={handleInputChange}
                className={classes.selectForm}
                error={errors?.category}
              >
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
              </Select>
            </div>
            <div className={classes.inputContainer}>
              <InputLabel>Description</InputLabel>
              <TextField
                name="description"
                type="text"
                value={description}
                onChange={handleInputChange}
                placeholder="Add a description"
                fullWidth
                error={errors?.description}
              />
            </div>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button type="submit">
            <span className={classes.labelButtonTransfer}>Transfer EOS</span>
          </Button>
        </div>
      </form>
      <div className={classes.divShadow}>
        <div className={classes.tableContainer}>
          <div
            style={{
              marginLeft: '5%',
              marginTop: '24px',
              fontSize: '18px',
              fontWeight: '500',
              letterSpacing: '-0.4px',
              color: 'rgba(0, 0, 0, 0.87)'
            }}
          >
            Tokens Sent By Your Account
          </div>
          <div id="id-table-container">
            <TableReport columns={columns} dataPercent={transactionsList} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SpendTools)
