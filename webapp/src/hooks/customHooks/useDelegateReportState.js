import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
  GET_EXPENSE_BY_CATEGORY,
  GET_INITIAL_DELEGATE_DATA
} from '../../gql/delegate.gql'
import {
  newDataFormatByTypeDelegate,
  newDataFormatByCategoryDelegate
} from '../../utils/new-format-objects'

const useDelegateReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(1)
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [delegateList, setDelegatesList] = useState([])
  const [transactionList, setTransactionList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [maxLevel, setMaxLevel] = useState(0)
  const [dateElection, setDateElection] = useState('2021-10-09T00:00:00+00:00')

  const [loadInitialData, { data: initialData }] = useLazyQuery(
    GET_INITIAL_DELEGATE_DATA
  )

  const [loadTransactions, { data: transactionsData }] = useLazyQuery(
    GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION
  )

  const [loadCategoryList, { data: categoryListData }] = useLazyQuery(
    GET_EXPENSE_BY_CATEGORY
  )

  const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
    GET_ELECTIONS_BY_YEAR,
    {
      variables: {
        minDate: `2021-01-01`,
        maxDate: `${new Date().getFullYear()}-12-31`
      }
    }
  )

  useEffect(() => {
    loadTransactions({
      variables: {
        election: electionRoundSelect,
        delegate: delegateSelect
      }
    })
    loadCategoryList({
      variables: {
        election: electionRoundSelect,
        delegate: delegateSelect
      }
    })
  }, [electionRoundSelect, delegateSelect])

  useEffect(() => {
    loadInitialData({
      variables: {
        election: electionRoundSelect
      }
    })
    loadElectionsByYear()
  }, [electionRoundSelect])
  console.log(electionRoundSelect)

  useEffect(() => {
    if (!initialData) return

    const length = initialData?.delegateFrontend?.data.length

    const maxLevel =
      initialData?.delegateFrontend?.data[length - 1].delegate_level
    const dateElection =
      initialData?.delegateFrontend?.data[length - 2].date_election
    const delegates = initialData.delegateFrontend?.data.slice(0, length - 3)
    setMaxLevel(maxLevel)
    setDateElection(dateElection)
    setDelegatesList(delegates)
  }, [initialData])

  // election
  useEffect(() => {
    if (!electionsByYearData?.eden_historic_election[0]) return
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setTransactionList(
      newDataFormatByTypeDelegate(
        transactionsData?.historic_incomes || [],
        transactionsData?.historic_expenses || []
      ) || []
    )
  }, [transactionsData])

  useEffect(() => {
    setCategoryList(
      newDataFormatByCategoryDelegate(
        categoryListData?.expenses_by_category_and_delegate || []
      )
    )
  }, [categoryListData])

  return [
    {
      electionRoundSelect,
      delegateSelect,
      electionsByYearList,
      transactionList,
      delegateList,
      categoryList,
      maxLevel,
      dateElection
    },
    {
      setElectionRoundSelect,
      setDelegateSelect,
      setDelegatesList
    }
  ]
}

export default useDelegateReportState
