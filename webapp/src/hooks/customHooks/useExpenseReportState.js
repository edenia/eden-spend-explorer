import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  newDataFormatPercentAllElections,
  newDataFormatPercentByElection,
  newDataFormatByClasification,
  newDataFormatTotalByCategory,
  newDataFormatByAllDelegates,
  newDataFormatByDelegate,
  newDataFormatByElection
} from '../../utils'
import {
  GET_CATEGORIZED_AND_UNCATEGORIZED_BY_ELECTION,
  GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY,
  GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_TOTAL_EXPENSE_BY_ELECTIONS_QUERY,
  GET_PERCENT_EXPENSES_ALL_ELECTIONS,
  GET_PERCENT_EXPENSES_BY_ELECTION,
  GET_EXPENSE_ELECTIONS_BY_YEAR,
  GET_TOTAL_EXPENSE_BY_CATEGORY
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

  const [totalByCategoryList, setTotalByCategoryList] = useState([])

  const [percentExpenseList, setPercentExpenseList] = useState([])

  const [categorizedAndUncategorizedList, setCategorizedAndUncategorizedList] =
    useState([])

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

  const [loadExpenseByAllDelegates, { data: expenseByAllDelegatesData }] =
    useLazyQuery(GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY, {
      variables: { election: electionRoundSelect }
    })

  const [loadExpenseByDelegateAccount, { data: expenseByAccountData }] =
    useLazyQuery(GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        election: electionRoundSelect,
        account: delegateSelect
      }
    })

  const [loadTotalIncomeByElection, { data: totalByElectionData }] =
    useLazyQuery(GET_TOTAL_EXPENSE_BY_ELECTIONS_QUERY)

  const [loadTotalByCategory, { data: totalByCategoryData }] = useLazyQuery(
    GET_TOTAL_EXPENSE_BY_CATEGORY
  )

  const [loadClaimedAndUnclaimed, { data: claimedAndUnclaimedData }] =
    useLazyQuery(GET_CATEGORIZED_AND_UNCATEGORIZED_BY_ELECTION, {
      variables: { election: electionRoundSelect }
    })

  const [loadPercentAllElections, { data: percentAllElectionData }] =
    useLazyQuery(GET_PERCENT_EXPENSES_ALL_ELECTIONS)

  const [loadPercentByElection, { data: percentByElectionData }] = useLazyQuery(
    GET_PERCENT_EXPENSES_BY_ELECTION,
    {
      variables: {
        election: electionRoundSelect
      }
    }
  )

  useEffect(() => {
    loadElectionsByYear()
    loadExpenseByAllDelegates()
    loadExpenseByDelegateAccount()
    loadTotalIncomeByElection()
    loadTotalByCategory()
    loadClaimedAndUnclaimed()
    loadPercentAllElections()
    loadPercentByElection()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setExpenseByAllDelegatesList(
      expenseByAllDelegatesData?.categorized_expenses_by_delegate || []
    )
    setDelegateSelect(
      expenseByAllDelegatesData?.categorized_expenses_by_delegate[0]
        ?.delegate_payer
    )
  }, [expenseByAllDelegatesData])

  useEffect(() => {
    setExpenseByDelegateList(expenseByAccountData?.eden_transaction || [])
  }, [expenseByAccountData])

  useEffect(() => {
    setCategorizedAndUncategorizedList(
      newDataFormatByClasification(
        claimedAndUnclaimedData?.historic_expenses || [],
        'categorized'
      )
    )
  }, [claimedAndUnclaimedData])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setPercentExpenseList(
        newDataFormatPercentAllElections(
          percentAllElectionData?.percent_by_all_elections_expenses || [],
          'categorized'
        )
      )
  }, [percentAllElectionData, showElectionRadio])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setTotalByCategoryList(
        newDataFormatTotalByCategory(
          totalByCategoryData?.total_by_category || []
        )
      )
  }, [showElectionRadio, totalByCategoryData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      showDelegateRadio === 'allDelegates' &&
      setPercentExpenseList(
        newDataFormatPercentByElection(
          percentByElectionData?.percent_by_delegates_expenses || [],
          'categorized'
        )
      )
  }, [showElectionRadio, showDelegateRadio, percentByElectionData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      showDelegateRadio === 'allDelegates' &&
      setChartTransactionsList(
        newDataFormatByAllDelegates(expenseByAllDelegatesList || [])
      )
  }, [showElectionRadio, showDelegateRadio])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      showDelegateRadio !== 'allDelegates' &&
      setChartTransactionsList(
        newDataFormatByDelegate(expenseByDelegateList, delegateSelect)
      )
  }, [showElectionRadio, showDelegateRadio, expenseByDelegateList])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setChartTransactionsList(
        newDataFormatByElection(totalByElectionData?.total_by_election || [])
      )
  }, [showElectionRadio, totalByElectionData])

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
      chartTransactionsList,
      totalByCategoryList,
      categorizedAndUncategorizedList,
      percentExpenseList
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
