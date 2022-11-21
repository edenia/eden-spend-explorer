import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_DELEGATES_BY_ELECTION,
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
  GET_EXPENSE_BY_CATEGORY,
  GET_MAX_DELEGATE_LEVEL,
  GET_INCOME_BY_ELECTION,
  GET_DATE_ELECTION
} from '../../gql/delegate.gql'
import {
  newDataFormatByTypeDelegate,
  newDataFormatByCategoryDelegate,
  newDataFormatDelegatesByElectionDelegate
} from '../../utils/new-format-objects'

const useDelegateReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [delegateList, setDelegatesList] = useState([])
  const [transactionList, setTransactionList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [maxLevel, setMaxLevel] = useState(0)
  const [dateElection, setDateElection] = useState('2021-10-09T00:00:00+00:00')

  const [loadDelegatesByElection, { data: delegatesByElectionData }] =
    useLazyQuery(GET_DELEGATES_BY_ELECTION)

  const [loadDateElection, { data: dateElectionData }] =
    useLazyQuery(GET_DATE_ELECTION)

  const [loadIncomeByElection, { data: incomeByElectionData }] = useLazyQuery(
    GET_INCOME_BY_ELECTION
  )

  const [loadMaxDelegateLevel, { data: maxDelegateLevelData }] = useLazyQuery(
    GET_MAX_DELEGATE_LEVEL
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
    loadDelegatesByElection({
      variables: {
        election: electionRoundSelect
      }
    })
    loadMaxDelegateLevel({
      variables: {
        election: electionRoundSelect
      }
    })
    loadIncomeByElection({
      variables: {
        election: electionRoundSelect
      }
    })
    loadDateElection({
      variables: {
        election: electionRoundSelect
      }
    })
    loadElectionsByYear()
  }, [electionRoundSelect])

  // election
  useEffect(() => {
    if (!electionsByYearData?.eden_historic_election[0]) return
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  // election
  useEffect(() => {
    if (!delegatesByElectionData && !incomeByElectionData) return

    setDelegatesList(
      newDataFormatDelegatesByElectionDelegate({
        delegateList:
          delegatesByElectionData?.transaction_by_category_and_election || [],
        incomeList: incomeByElectionData?.historic_incomes || []
      }) || []
    )
    setDelegateSelect(
      delegatesByElectionData?.transaction_by_category_and_election[0]
        ?.delegate_payer
    )
  }, [delegatesByElectionData, incomeByElectionData])

  // election
  useEffect(() => {
    setMaxLevel(maxDelegateLevelData?.eden_election[0]?.delegate_level)
  })

  // election
  useEffect(() => {
    setDateElection(dateElectionData?.eden_historic_election[0]?.date_election)
  }, [dateElectionData])

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
