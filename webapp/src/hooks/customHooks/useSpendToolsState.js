import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import ReactGA from 'react-ga'

import { useSharedState } from '../../context/state.context'
import { useImperativeQuery } from '../../utils'
import {
  GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_AGGREGATE_TRANSACTION,
  EDIT_TRANSACTION_BY_TXID,
  SAVE_TRANSACTION,
  GET_ELECTIONS
} from '../../gql'

import useForm from './useForm'

const useSpendTools = () => {
  const [state] = useSharedState()
  const { eosRate = 0, delegateBalance } = state.eosTrasuryBalance
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
  const getTransactions = useImperativeQuery(
    GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY
  )

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
      ) {
        return { idElection: id }
      }
    }
    return {
      idElection: elections.at(-1).id
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

      setOpenSnackbar(true)

      if (openModal && transactionResult?.status === 'executed') {
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

        setOpenModal(false)
        resetModal()
      } else {
        if (transactionResult?.status === 'executed') {
          const amount = Number(formValues.amount.split(' ')[0])
          const { idElection } = await getElectionWithLessExpense(amount)
          const payload = {
            amount,
            category: formValues.category,
            date: transactionResult?.transaction.processed.block_time,
            description: formValues.description,
            eos_exchange: eosRate,
            id_election: idElection,
            memo: `eden_expense:${formValues.category}/${formValues.description}`,
            recipient: formValues.to,
            txid: transactionResult?.transactionId,
            type: 'expense',
            usd_total: amount * eosRate
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
        }

        ReactGA.event({
          category: 'transaction',
          action: 'send tokens',
          label: `from: ${formValues.to}, to: ${authenticatedUser}`,
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

  useEffect(async () => {
    setAuthenticatedUser(state.user?.accountName)

    const { data: transactions } = await getTransactions({
      account: state.user?.accountName
    })

    setTransactionsList(transactions?.eden_transaction || [])
  }, [state.user?.accountName])

  return [
    {
      delegateBalance,
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
      setOpenSnackbar
    }
  ]
}

export default useSpendTools
