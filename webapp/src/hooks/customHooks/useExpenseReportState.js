import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  newDataFormatByAllDelegates,
  newDataFormatByDelegate,
  newDataFormatByElection
} from '../../utils'
import {
  GET_EXPENSE_ELECTIONS_BY_YEAR,
  GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY,
  GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_TOTAL_EXPENSE_BY_ELECTIONS_QUERY
} from '../../gql'

const useExpenseReport = () => {
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [showDelegateRadio, setShowDelegateRadio] = useState('allDelegates')
  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionRoundSelect, setElectionRoundSelect] = useState()
  const [showEosRateSwitch, setShowEosRateSwitch] = useState(true)
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [expenseByAllDelegatesList, setExpenseByAllDelegatesList] = useState([])
  const [expenseByDelegateList, setExpenseByDelegateList] = useState([])
  const [chartTransactionsList, setChartTransactionsList] = useState([])

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
    GET_EXPENSE_ELECTIONS_BY_YEAR,
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

  const [loadIncomeByAllDelegates, { data: expenseByAllDelegatesData }] =
    useLazyQuery(GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY, {
      variables: { election: electionRoundSelect }
    })

  const [loadIncomeByDelegateAccount, { data: expenseByAccountData }] =
    useLazyQuery(GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        election: electionRoundSelect,
        account: delegateSelect
      }
    })

  const [loadTotalIncomeByElection, { data: totalByElectionData }] =
    useLazyQuery(GET_TOTAL_EXPENSE_BY_ELECTIONS_QUERY)

  useEffect(() => {
    loadElectionsByYear()
    loadIncomeByAllDelegates()
    loadIncomeByDelegateAccount()
    loadTotalIncomeByElection()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setExpenseByAllDelegatesList(expenseByAllDelegatesData?.eden_election || [])
    setDelegateSelect(
      expenseByAllDelegatesData?.eden_election[0]?.eden_delegate.account
    )
  }, [expenseByAllDelegatesData])

  useEffect(() => {
    setExpenseByDelegateList(expenseByAccountData?.eden_transaction || [])
  }, [expenseByAccountData])

  useEffect(() => {
    if (showElectionRadio === 'allElections') {
      setChartTransactionsList(
        newDataFormatByElection(totalByElectionData?.total_by_election || [])
      )
    } else {
      if (showDelegateRadio === 'allDelegates') {
        setChartTransactionsList(
          newDataFormatByAllDelegates(expenseByAllDelegatesList)
        )
      } else {
        setChartTransactionsList(
          newDataFormatByDelegate(expenseByDelegateList, delegateSelect)
        )
      }
    }
  }, [
    showElectionRadio,
    showDelegateRadio,
    totalByElectionData,
    expenseByDelegateList
  ])

  return [
    {
      showElectionRadio,
      showDelegateRadio,
      typeCurrencySelect,
      showEosRateSwitch,
      electionYearSelect,
      delegateSelect,
      electionRoundSelect,
      electionsByYearList,
      expenseByAllDelegatesList,
      chartTransactionsList
    },
    {
      setShowElectionRadio,
      setShowDelegateRadio,
      setTypeCurrencySelect,
      setShowEosRateSwitch,
      setElectionYearSelect,
      setDelegateSelect,
      setElectionRoundSelect,
      getListElectionYears
    }
  ]
}

export default useExpenseReport
