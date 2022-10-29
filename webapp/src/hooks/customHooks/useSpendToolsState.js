import { GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY } from '../../gql'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import useForm from './useForm'

const useSpendTools = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState('')
  const [transactionsList, setTransactionsList] = useState([])
  const [errors, setErrors] = useState({})
  const [openModal, setOpenModal] = useState(false)

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
  }

  const handleOpenModal = transaction => {
    setOpenModal(true)
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
    { transactionsList, formValues, errors, openModal, formValuesModal },
    {
      handleInputChange,
      reset,
      validateForm,
      handleCloseModal,
      handleOpenModal,
      handleInputChangeModal,
      resetModal
    }
  ]
}

export default useSpendTools
