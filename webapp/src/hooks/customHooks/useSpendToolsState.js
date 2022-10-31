import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY } from '../../gql'

import useForm from './useForm'

const useSpendTools = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState('')
  const [transactionsList, setTransactionsList] = useState([])
  const [errors, setErrors] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [modalData, setModalData] = useState({})

  const [formValues, handleInputChange, reset] = useForm({
    to: '',
    amount: '',
    category: '',
    description: ''
  })
  const [formValuesModal, handleInputChangeModal, resetModal] = useForm({
    newCategory: '',
    newDescription: ''
  })

  const executeAction = async (data, account, name, state) => {
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
      const result = await state.ual.activeUser.signTransaction(transaction, {
        broadcast: true
      })

      console.log(result, 'the result')

      openModal ? resetModal() : reset()
    } catch (error) {
      console.log(error)

      setErrorMessage(error.message)
    }
  }

  const validateForm = form => {
    let formErrors = {}
    Object.keys(form).forEach(key => {
      if (form[key].length < 1) {
        formErrors = { ...formErrors, [key]: true }
      } else {
        const newErrors = { ...formErrors }
        delete newErrors[key]
        formErrors = { ...newErrors }
      }
    })
    setErrors(formErrors)
    return formErrors
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

  const [loadUncaterizedTransactions, { data: uncategorizedTxData }] =
    useLazyQuery(GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        account: authenticatedUser
      }
    })

  useEffect(() => {
    loadUncaterizedTransactions()
    setAuthenticatedUser('xavieredenia')
  }, [])

  useEffect(() => {
    setTransactionsList(uncategorizedTxData?.eden_transaction || [])
  }, [uncategorizedTxData])

  return [
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
      reset,
      handleInputChangeModal,
      resetModal,
      validateForm,
      handleCloseModal,
      handleOpenModal,
      executeAction
    }
  ]
}

export default useSpendTools
