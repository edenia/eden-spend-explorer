import ReactGA from 'react-ga'
import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'

import { useSharedState } from '../../context/state.context'
import { useImperativeQuery } from '../../utils'
import {
  GET_EXPENSES_BY_ACCOUNT,
  GET_AGGREGATE_TRANSACTION,
  EDIT_TRANSACTION_BY_TXID,
  SAVE_TRANSACTION,
  GET_ELECTIONS
} from '../../gql'

import useForm from './useForm'

const useSpendTools = () => {
  const [state] = useSharedState()
  const { eosRate = 0 } = state.eosTrasuryBalance
  const [authenticatedUser, setAuthenticatedUser] = useState('')
  const [transactionsList, setTransactionsList] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState({})
  const [loadingSignTransaction, setLoadingSignTransaction] = useState(false)

  const [formValues, handleInputChange, reset, errors, validateForm] = useForm({
    to: '',
    amount: '',
    category: '',
    description: ''
  })

  const [
    formValuesModal,
    handleInputChangeModal,
    resetModal,
    errorsModal,
    validateFormModal
  ] = useForm({
    newCategory: '',
    newDescription: ''
  })

  const [editTransaction] = useMutation(EDIT_TRANSACTION_BY_TXID)
  const [saveTransaction] = useMutation(SAVE_TRANSACTION)

  const getAggregateTransaction = useImperativeQuery(GET_AGGREGATE_TRANSACTION)
  const getElections = useImperativeQuery(GET_ELECTIONS)
  const getTransactions = useImperativeQuery(GET_EXPENSES_BY_ACCOUNT)

  const getElectionWithLessExpense = async amount => {
    const { data: elections } = await getElections({
      where: { eden_delegate: { account: { _eq: authenticatedUser } } }
    })

    for (const { election, id } of elections?.eden_election) {
      const { data: income } = await getAggregateTransaction({
        where: {
          eden_election: {
            eden_delegate: { account: { _eq: authenticatedUser } },
            election: { _eq: election }
          },
          type: { _eq: 'income' }
        }
      })

      const { data: expense } = await getAggregateTransaction({
        where: {
          eden_election: {
            eden_delegate: { account: { _eq: authenticatedUser } },
            election: { _eq: election }
          },
          type: { _eq: 'expense' },
          category: { _neq: 'uncategorized' }
        }
      })

      if (
        expense?.eden_transaction_aggregate.aggregate.sum.amount + amount <=
        income?.eden_transaction_aggregate.aggregate.sum.amount
      )
        return { idElection: id }
    }

    return {
      idElection: elections?.at(-1).id
    }
  }

  const executeAction = async (data, account, name) => {
    setErrorMessage('')
    setLoadingSignTransaction(true)

    const transaction = {
      actions: [
        {
          authorization: [
            {
              actor: authenticatedUser,
              permission: 'active'
            }
          ],
          account,
          name,
          data
        }
      ]
    }

    try {
      const transactionResult = await state.ual.activeUser.signTransaction(
        transaction,
        {
          broadcast: true
        }
      )

      setLoadingSignTransaction(false)

      setOpenSnackbar(true)

      return transactionResult
    } catch (error) {
      setErrorMessage(error.message)

      setLoadingSignTransaction(false)
    }
  }

  const handleRecategorizeTx = async e => {
    e.preventDefault()

    if (Object.keys(validateFormModal(formValuesModal)).length > 0) return

    const dataAction = {
      account: state.user?.accountName,
      new_memo: `eden_expense:${formValuesModal.newCategory}/${formValuesModal.newDescription}`,
      tx_id: modalData?.txid,
      digest: modalData?.digest
    }

    if (modalData?.digest === modalData?.txid) {
      setErrorMessage(
        'You must wait because the transaction continues without digest'
      )

      return
    }

    const txResult = await executeAction(
      dataAction,
      'edenexplorer',
      'categorize'
    )

    if (txResult?.status !== 'executed') return

    const { idElection } = await getElectionWithLessExpense(modalData?.amount)

    ReactGA.event({
      category: 'transaction',
      action: 'update transaction',
      label: modalData?.txid
    })

    editTransaction({
      variables: {
        where: {
          txid: { _eq: modalData?.txid },
          digest: { _eq: modalData?.digest }
        },
        _set: {
          category: formValuesModal.newCategory,
          description: formValuesModal.newDescription,
          id_election: idElection
        }
      }
    })

    setTransactionsList(
      transactionsList.map(transaction =>
        transaction.txid === modalData?.txid
          ? {
              ...transaction,
              category: formValuesModal.newCategory,
              description: formValuesModal.newDescription
            }
          : transaction
      )
    )

    setOpenModal(false)
    resetModal()
  }

  const handleEosTransfer = async e => {
    e.preventDefault()

    if (Object.keys(validateForm(formValues)).length > 0) return

    const dataAction = {
      from: state.user?.accountName,
      to: formValues.to,
      quantity: formValues.amount,
      memo: `eden_expense:${formValues.category}/${formValues.description}`
    }

    const txResult = await executeAction(dataAction, 'eosio.token', 'transfer')

    if (txResult?.status !== 'executed') return

    const amount = Number(formValues.amount.split(' ')[0])

    const { idElection } = await getElectionWithLessExpense(amount)

    const payload = {
      amount,
      category: formValues.category,
      date: txResult?.transaction.processed.block_time,
      description: formValues.description,
      eos_exchange: eosRate,
      id_election: idElection,
      recipient: formValues.to,
      txid: txResult?.transactionId,
      type: 'expense',
      usd_total: amount * eosRate,
      digest: txResult?.transactionId
    }

    await saveTransaction({
      variables: {
        payload
      }
    })

    const { data: transactions } = await getTransactions({
      account: state.user?.accountName
    })

    setTransactionsList(transactions?.eden_transaction || [])

    ReactGA.event({
      category: 'transaction',
      action: 'send tokens',
      label: `from: ${formValues.to}, to: ${authenticatedUser}`,
      value: Number(formValues.amount)
    })

    reset()
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setErrorMessage('')
  }

  const handleOpenModal = transaction => {
    setModalData(transaction.row)
    setOpenModal(true)
    setErrorMessage('')
  }

  useEffect(async () => {
    setAuthenticatedUser(state.user?.accountName)

    const { data: transactions } = await getTransactions({
      account: state.user?.accountName
    })

    setTransactionsList(transactions?.eden_transaction || [])
  }, [state.user?.accountName])

  return [
    {
      transactionsList,
      formValues,
      errors,
      errorsModal,
      openModal,
      formValuesModal,
      errorMessage,
      modalData,
      openSnackbar,
      loadingSignTransaction
    },
    {
      handleInputChange,
      handleInputChangeModal,
      handleCloseModal,
      handleOpenModal,
      setOpenSnackbar,
      handleRecategorizeTx,
      handleEosTransfer
    }
  ]
}

export default useSpendTools
