import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_DELEGATES_BY_ELECTION,
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION
} from '../../gql/delegate.gql'
import { newDataFormatByTypeDelegate } from '../../utils/new-format-objects'

const useDelegateReportState = () => {
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [delegateList, setDelegatesList] = useState([])
  const [transactionList, setTransactionList] = useState([])

  const [loadDelegatesByElection, { data: delegatesByElectionData }] =
    useLazyQuery(GET_DELEGATES_BY_ELECTION, {
      variables: {
        election: electionRoundSelect
      }
    })

  const [loadTransactions, { data: transactionsData }] = useLazyQuery(
    GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
    {
      variables: {
        election: electionRoundSelect,
        delegate: delegateSelect
      }
    }
  )

  const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
    GET_ELECTIONS_BY_YEAR,
    {
      variables:
        electionYearSelect === 'All' || electionYearSelect === 'Todos'
          ? {
              minDate: `2021-01-01`,
              maxDate: `${new Date().getFullYear()}-12-31`
            }
          : {
              minDate: `${electionYearSelect}-01-01`,
              maxDate: `${electionYearSelect}-12-31`
            }
    }
  )

  useEffect(() => {
    loadDelegatesByElection()
    loadElectionsByYear()
    loadTransactions()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setDelegatesList(
      delegatesByElectionData?.transaction_by_category_and_election || []
    )
    setDelegateSelect(
      delegatesByElectionData?.transaction_by_category_and_election[0]
        ?.delegate_payer
    )
  }, [delegatesByElectionData])

  useEffect(() => {
    setTransactionList(
      newDataFormatByTypeDelegate(
        transactionsData?.historic_incomes || [],
        transactionsData?.historic_expenses || []
      ) || []
    )
  }, [transactionsData])

  return [
    {
      electionRoundSelect,
      delegateSelect,
      electionsByYearList,
      transactionList,
      delegateList
    },
    {
      setElectionRoundSelect,
      setElectionYearSelect,
      setDelegateSelect
    }
  ]
}

export default useDelegateReportState
