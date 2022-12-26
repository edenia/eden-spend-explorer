import { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import ReactGA from 'react-ga'

import { useSharedState } from '../../context/state.context'
import { sleep } from '../../utils/sleep'
import { eosApi } from '../../utils/eosapi'
import {
  GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY,
  EDIT_TRANSACTION_BY_TXID,
  SAVE_TRANSACTION,
  GET_ELECTIONS
} from '../../gql'

import useForm from './useForm'

const useSpendTools = () => {
  const [state] = useSharedState()
  const { eosRate = 0 } = state.eosTrasuryBalance
  const [currencyBalance, setCurrencyBalance] = useState('Loading... ')
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

  const getEosBalance = async delegate => {
    try {
      const response = await eosApi.getCurrencyBalance(
        'eosio.token',
        delegate,
        'EOS'
      )

      setCurrencyBalance(response[0] || '')
    } catch (error) {
      console.error(error)
      await sleep(60)
      getEosBalance()
    }
  }

  const [loadUncategorizedTransactions, { data: uncategorizedTxData }] =
    useLazyQuery(GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        account: authenticatedUser
      }
    })

  const [loadElectionsByYear, { data: delegateElections }] = useLazyQuery(
    GET_ELECTIONS,
    {
      variables: {
        where: { eden_delegate: { account: { _eq: state.user?.accountName } } }
      }
    }
  )

  const executeAction = async (data, account, name) => {
    setErrorMessage('')
    setLoadingSignTransaction(true)

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
      const transactionResult = await state.ual.activeUser.signTransaction(
        transaction,
        {
          broadcast: true
        }
      )

      setOpenSnackbar(true)

      if (openModal) {
        ReactGA.event({
          category: 'transaction',
          action: 'update transaction',
          label: modalData?.txid
        })

        editTransaction({
          variables: {
            where: {
              txid: { _eq: modalData?.txid },
              amount: { _eq: modalData?.amount },
              recipient: { _eq: modalData?.recipient },
              memo: { _eq: modalData?.memo },
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
        if (
          transactionResult?.status === 'executed' &&
          delegateElections?.eden_election.at(-1)?.id
        ) {
          const payload = {
            amount: Number(formValues.amount.split(' ')[0]),
            category: formValues.category,
            date: transactionResult?.transaction.processed.block_time,
            description: formValues.description,
            eos_exchange: eosRate,
            id_election: delegateElections?.eden_election.at(-1).id,
            memo: `eden_expense:${formValues.category}/${formValues.description}`,
            recipient: formValues.to,
            txid: transactionResult?.transactionId,
            type: 'expense',
            usd_total: Number(formValues.amount.split(' ')[0]) * eosRate
          }

          saveTransaction({
            variables: {
              payload
            }
          })
        }

        ReactGA.event({
          category: 'transaction',
          action: 'send tokens',
          label: `from: ${formValues.to}, to: ${state.user?.accountName}`,
          value: Number(formValues.amount)
        })
        reset()
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
    setLoadingSignTransaction(false)
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

  useEffect(() => {
    loadUncategorizedTransactions()
    loadElectionsByYear()
  }, [])

  useEffect(() => {
    setTransactionsList(uncategorizedTxData?.eden_transaction || [])
  }, [uncategorizedTxData])

  useEffect(() => {
    setAuthenticatedUser(state.user?.accountName)
  }, [state.user?.accountName])

  return [
    {
      currencyBalance,
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
      reset,
      handleInputChangeModal,
      resetModal,
      validateForm,
      validateFormModal,
      handleCloseModal,
      handleOpenModal,
      executeAction,
      setOpenSnackbar,
      getEosBalance
    }
  ]
}

export default useSpendTools
