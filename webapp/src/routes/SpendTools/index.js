import React, { memo, useState } from 'react'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import { IconButton, MenuItem, Modal, TextField, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'

import useSpendTools from '../../hooks/customHooks/useSpendToolsState'
import TableReport from '../../components/TableReport'
import styles from './styles'

const useStyles = makeStyles(styles)

const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const SpendTools = () => {
  const classes = useStyles()
  const [{ transactionsList }] = useSpendTools()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = transaction => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

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
                <Select className={classes.selectForm}>
                  <MenuItem>Holi</MenuItem>
                </Select>
              </div>
              <div className={classes.inputContainer}>
                <InputLabel>Description</InputLabel>
                <TextField fullWidth />
              </div>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <Button>
              <span className={classes.labelButtonTransfer}>Append Memo</span>
            </Button>
          </div>
        </div>
      </Modal>
      <div>A set of tools that will help you perform new transactions with</div>

      <div className={classes.toolInformation}>
        Here you can send tokens related with Eden funds.
      </div>

      <div className={classes.formContainer}>
        <div className={classes.rowFormContainer}>
          <div className={classes.inputContainer}>
            <InputLabel>Send Tokens To</InputLabel>
            <TextField fullWidth />
          </div>
          <div className={classes.specialInput}>
            <div id="labels-id">
              <label id="amount-id">Amount</label>
              <label id="available-id">Available: 1,250.54 EOS</label>
            </div>
            <TextField fullWidth helperText="Some important text" />
          </div>
        </div>
        <div className={classes.rowFormContainer}>
          <div className={classes.inputContainer}>
            <InputLabel>Category</InputLabel>
            <Select className={classes.selectForm}>
              <MenuItem>Holi</MenuItem>
            </Select>
          </div>
          <div className={classes.inputContainer}>
            <InputLabel>Description</InputLabel>
            <TextField fullWidth />
          </div>
        </div>
      </div>

      <div className={classes.buttonContainer}>
        <Button>
          <span className={classes.labelButtonTransfer}>Transfer EOS</span>
        </Button>
      </div>
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
