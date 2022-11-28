import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'

import { useSharedState } from '../../context/state.context'
import {
  GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_CATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_ACTUAL_ELECTION_QUERY,
  EDIT_TRANSACTION_BY_TXID
} from '../../gql'

import useForm from './useForm'

const useSpendTools = () => {
  const [state] = useSharedState()
  const [authenticatedUser, setAuthenticatedUser] = useState('')
  const [amountCategorized, setAmountCategorized] = useState(0)
  const [transactionsList, setTransactionsList] = useState([])
  const [currentElection, setCurrentElection] = useState(0)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [amountClaimed, setAmountClaimed] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState({})

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

  const executeAction = async (data, account, name) => {
    setErrorMessage('')

    const transaction = {
      actions: [
        {
          authorization: [
            {
              actor: state.user?.accountName,
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
      await state.ual.activeUser.signTransaction(transaction, {
        broadcast: true
      })

      setOpenSnackbar(true)

      if (openModal) {
        editTransaction({
          variables: {
            where: {
              txid: { _eq: modalData?.txid },
              type: { _eq: 'expense' }
            },
            _set: {
              category: formValuesModal.newCategory,
              description: formValuesModal.newDescription
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

        resetModal()
      } else {
        reset()
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
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

  const [loadUncategorizedTransactions, { data: uncategorizedTxData }] =
    useLazyQuery(GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        account: authenticatedUser
      }
    })

  const [loadCategorizedAmount, { data: categorizedTxData }] = useLazyQuery(
    GET_CATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY,
    {
      variables: {
        account: authenticatedUser,
        category: 'uncategorized',
        election: currentElection
      }
    }
  )

  const [loadClaimedAmount, { data: claimedTxData }] = useLazyQuery(
    GET_CATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY,
    {
      variables: {
        account: authenticatedUser,
        category: 'unclaimed',
        election: currentElection
      }
    }
  )

  const [loadCurrentElection, { data: currentElectionData }] = useLazyQuery(
    GET_ACTUAL_ELECTION_QUERY
  )

  useEffect(() => {
    loadUncategorizedTransactions()
    loadCategorizedAmount()
    loadClaimedAmount()
    loadCurrentElection()
  }, [])

  useEffect(() => {
    setTransactionsList(uncategorizedTxData?.eden_transaction || [])
  }, [uncategorizedTxData])

  useEffect(() => {
    setAmountCategorized(
      categorizedTxData?.eden_transaction_aggregate?.aggregate?.sum?.amount || 0
    )
  }, [categorizedTxData])

  useEffect(() => {
    setAmountClaimed(
      claimedTxData?.eden_transaction_aggregate?.aggregate?.sum?.amount || 0
    )
  }, [claimedTxData])

  useEffect(() => {
    setCurrentElection(
      currentElectionData?.eden_historic_election[0]?.election || 0
    )
  }, [currentElectionData])

  useEffect(() => {
    setAuthenticatedUser(state.user?.accountName)
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
      amountCategorized,
      amountClaimed,
      openSnackbar
    },
    {
      handleInputChange,
      reset,
      handleInputChangeModal,
      resetModal,
      validateForm,
      validateFormModal,
      handleCloseModal,
      handleOpenModal,
      executeAction,
      setOpenSnackbar
    }
  ]
}

export default useSpendTools
