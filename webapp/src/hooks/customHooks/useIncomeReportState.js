import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  GET_INCOME_TRANSACTIONS_DELEGATES_QUERY,
  GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_TOTAL_BY_ELECTIONS_QUERY,
  GET_ELECTIONS_BY_YEAR,
  GET_INCOMES_CLAIMED_AND_UNCLAIMED_BY_ELECTION,
  GET_TOTAL_BY_CATEGORY,
  GET_TOTAL_BY_CATEGORY_AND_ELECTION,
  GET_PERCENT_ALL_ELECTIONS,
  GET_PERCENT_BY_ELECTIONS
} from '../../gql'
import {
  newDataFormatByAllDelegatesIncome,
  newDataFormatByClasification,
  newDataFormatByDelegate,
  newDataFormatByElection,
  newDataFormatPercentAllElections,
  newDataFormatPercentByElection,
  newDataFormatTotalByCategory
} from '../../utils'

const useIncomeReportState = () => {
  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [delegateSelect, setDelegateSelect] = useState('')
  const [showDelegateRadio, setShowDelegateRadio] = useState('allDelegates')
  const [showElectionRadio, setShowElectionRadio] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [chartTransactionsList, setChartTransactionsList] = useState([])
  const [incomeByAllDelegatesList, setIncomeByAllDelegatesList] = useState([])
  const [incomeByDelegateAccountList, setIncomeByDelegateAccountList] =
    useState([])
  const [incomeClaimedAndUnclaimedList, setIncomeClaimedAndUnclaimedList] =
    useState([])
  const [totalByCategoryList, setTotalByCategoryList] = useState([])
  const [percentIncomeList, setPercentIncomeList] = useState([])

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadTotalIncomeByElection, { data: totalByElectionData }] =
    useLazyQuery(GET_TOTAL_BY_ELECTIONS_QUERY)

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

  const [loadIncomeByAllDelegates, { data: icomeByAllDelegatesData }] =
    useLazyQuery(GET_INCOME_TRANSACTIONS_DELEGATES_QUERY, {
      variables: { election: electionRoundSelect }
    })

  const [loadIncomeByDelegateAccount, { data: incomeByAccountData }] =
    useLazyQuery(GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        election: electionRoundSelect,
        account: delegateSelect
      }
    })

  const [loadClaimedAndUnclaimedByElection, { data: claimedAndUnclaimedData }] =
    useLazyQuery(GET_INCOMES_CLAIMED_AND_UNCLAIMED_BY_ELECTION, {
      variables: {
        election: electionRoundSelect
      }
    })

  const [
    loadTotalByCategoryAndElection,
    { data: totalByCategoryAndElectionData }
  ] = useLazyQuery(GET_TOTAL_BY_CATEGORY_AND_ELECTION, {
    variables: {
      election: electionRoundSelect
    }
  })

  const [loadTotalClaimedAndUnclaimed, { data: totalByCategoryData }] =
    useLazyQuery(GET_TOTAL_BY_CATEGORY)

  const [loadPercentAllElections, { data: percentAllElectionData }] =
    useLazyQuery(GET_PERCENT_ALL_ELECTIONS)

  const [loadPercentByElection, { data: percentByElectionData }] = useLazyQuery(
    GET_PERCENT_BY_ELECTIONS,
    {
      variables: {
        election: electionRoundSelect
      }
    }
  )

  useEffect(() => {
    loadElectionsByYear()
    loadIncomeByAllDelegates()
    loadIncomeByDelegateAccount()
    loadTotalIncomeByElection()
    loadTotalByCategoryAndElection()
    loadClaimedAndUnclaimedByElection()
    loadTotalClaimedAndUnclaimed()
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
    setIncomeByAllDelegatesList(icomeByAllDelegatesData?.eden_election || [])
    setDelegateSelect(
      icomeByAllDelegatesData?.eden_election[0]?.eden_delegate.account
    )
  }, [icomeByAllDelegatesData])

  useEffect(() => {
    setIncomeByDelegateAccountList(incomeByAccountData?.eden_transaction || [])
  }, [incomeByAccountData])

  useEffect(() => {
    setIncomeClaimedAndUnclaimedList(
      newDataFormatByClasification(
        claimedAndUnclaimedData?.historic_incomes || [],
        'claimed'
      )
    )
  }, [claimedAndUnclaimedData])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setPercentIncomeList(
        newDataFormatPercentAllElections(
          percentAllElectionData?.percent_by_all_elections_incomes || [],
          'claimed'
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
      setPercentIncomeList(
        newDataFormatPercentByElection(
          percentByElectionData?.percent_by_delegates_incomes || [],
          'claimed'
        )
      )
  }, [showElectionRadio, showDelegateRadio, percentByElectionData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      showDelegateRadio === 'allDelegates' &&
      setChartTransactionsList(
        newDataFormatByAllDelegatesIncome(incomeByAllDelegatesList || [])
      )
  }, [showElectionRadio, showDelegateRadio, incomeByAllDelegatesList])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      showDelegateRadio !== 'allDelegates' &&
      setChartTransactionsList(
        newDataFormatByDelegate(incomeByDelegateAccountList, delegateSelect)
      )
  }, [showElectionRadio, showDelegateRadio, incomeByDelegateAccountList])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setChartTransactionsList(
        newDataFormatByElection(totalByElectionData?.total_by_election || [])
      )
  }, [showElectionRadio, totalByElectionData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      setTotalByCategoryList(
        newDataFormatTotalByCategory(
          totalByCategoryAndElectionData?.total_by_category_and_election || []
        )
      )
  }, [showElectionRadio, totalByCategoryAndElectionData])

  return [
    {
      chartTransactionsList,
      typeCurrencySelect,
      electionYearSelect,
      electionRoundSelect,
      showDelegateRadio,
      delegateSelect,
      incomeByAllDelegatesList,
      electionsByYearList,
      showElectionRadio,
      incomeClaimedAndUnclaimedList,
      totalByCategoryList,
      percentIncomeList
    },
    {
      setTypeCurrencySelect,
      getListElectionYears,
      setElectionYearSelect,
      setElectionRoundSelect,
      setShowDelegateRadio,
      setDelegateSelect,
      setShowElectionRadio
    }
  ]
}

export default useIncomeReportState
