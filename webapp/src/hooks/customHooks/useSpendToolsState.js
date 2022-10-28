import { GET_UNCATEGORIZED_TRANSACTIONS_BY_ACCOUNT_QUERY } from '../../gql'
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

const useSpendTools = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState('')
  const [transactionsList, setTransactionsList] = useState([])

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

  return [{ transactionsList }, {}]
}

export default useSpendTools
