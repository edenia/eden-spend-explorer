import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_DELEGATES_BY_ELECTION,
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
  GET_EXPENSE_BY_CATEGORY,
  GET_MAX_DELEGATE_LEVEL,
  GET_INCOME_BY_ELECTION
} from '../../gql/delegate.gql'
import {
  newDataFormatByTypeDelegate,
  newDataFormatByCategoryDelegate,
  newDataFormatDelegatesByElectionDelegate
} from '../../utils/new-format-objects'

const useDelegateReportState = () => {
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [delegateList, setDelegatesList] = useState([])
  const [transactionList, setTransactionList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [maxLevel, setMaxLevel] = useState(0)

  const [loadDelegatesByElection, { data: delegatesByElectionData }] =
    useLazyQuery(GET_DELEGATES_BY_ELECTION, {
      variables: {
        election: electionRoundSelect
      }
    })

  const [loadIncomeByElection, { data: incomeByElectionData }] = useLazyQuery(
    GET_INCOME_BY_ELECTION,
    {
      variables: {
        election: electionRoundSelect
      }
    }
  )

  const [loadMaxDelegateLevel, { data: maxDelegateLevelData }] = useLazyQuery(
    GET_MAX_DELEGATE_LEVEL,
    {
      variables: {
        election: electionRoundSelect
      }
    }
  )

  const [loadTransactions, { data: transactionsData }] = useLazyQuery(
    GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
    {
      variables: {
        election: electionRoundSelect,
        delegate: delegateSelect
      }
    }
  )

  const [loadCategoryList, { data: categoryListData }] = useLazyQuery(
    GET_EXPENSE_BY_CATEGORY,
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
    if (
      (electionRoundSelect !== null || electionRoundSelect !== undefined) &&
      delegateSelect !== undefined &&
      delegateSelect !== ''
    ) {
      loadTransactions()
      loadCategoryList()
    }
  }, [electionRoundSelect, delegateSelect])

  useEffect(() => {
    if (electionRoundSelect !== null || electionRoundSelect !== undefined) {
      loadDelegatesByElection()
      loadElectionsByYear()
      loadMaxDelegateLevel()
      loadIncomeByElection()
    }
  }, [electionRoundSelect])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

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

  useEffect(() => {
    setMaxLevel(maxDelegateLevelData?.eden_election[0]?.delegate_level)
  })

  return [
    {
      electionRoundSelect,
      delegateSelect,
      electionsByYearList,
      transactionList,
      delegateList,
      categoryList,
      maxLevel
    },
    {
      setElectionRoundSelect,
      setElectionYearSelect,
      setDelegateSelect,
      setDelegatesList
    }
  ]
}

export default useDelegateReportState
