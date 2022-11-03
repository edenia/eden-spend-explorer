import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_TOTAL_BY_ELECTIONS_QUERY,
  GET_INCOMES_CLAIMED_AND_UNCLAIMED_BY_ELECTION,
  GET_TOTAL_BY_CATEGORY,
  GET_TOTAL_BY_CATEGORY_AND_ELECTION,
  GET_PERCENT_ALL_ELECTIONS,
  GET_PERCENT_BY_ELECTIONS,
  GET_TOTAL_CLAIMED,
  GET_INCOME_CATEGORIES_BY_ELECTION_AND_DELEGATE
} from '../../gql'

import {
  newDataFormatByDelegate,
  newDataFormatByElection,
  newDataFormatPercentAllElections,
  newDataFormatPercentByElection,
  newDataFormatTotalByCategory,
  newDataFormatByDelegateAcrossElections
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
  const [incomeByDelegateAccountList, setIncomeByDelegateAccountList] =
    useState([])
  const [totalByCategoryList, setTotalByCategoryList] = useState([])
  const [percentIncomeList, setPercentIncomeList] = useState([])
  const [totalClaimedList, setTotalClaimedList] = useState([])
  const [claimedIncomeByDelegate, setClaimedIncomeByDelegate] = useState([])

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

  const [loadTotalClaimed, { data: totalClaimedData }] =
    useLazyQuery(GET_TOTAL_CLAIMED)

  const [
    loadIncomeCategoriesByElectionAndDelegate,
    { data: incomeCategoriesByElectionAndDelegateData }
  ] = useLazyQuery(GET_INCOME_CATEGORIES_BY_ELECTION_AND_DELEGATE, {
    variables: {
      election: electionRoundSelect,
      delegate: delegateSelect
    }
  })

  useEffect(() => {
    loadElectionsByYear()
    loadIncomeByDelegateAccount()
    loadTotalIncomeByElection()
    loadTotalByCategoryAndElection()
    loadClaimedAndUnclaimedByElection()
    loadTotalClaimedAndUnclaimed()
    loadPercentAllElections()
    loadPercentByElection()
    loadTotalClaimed()
    loadIncomeCategoriesByElectionAndDelegate()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setIncomeByDelegateAccountList(incomeByAccountData?.eden_transaction || [])
  }, [incomeByAccountData])

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

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setTotalClaimedList(
        newDataFormatTotalByCategory(
          totalClaimedData?.total_by_category_and_election || []
        )
      )
  }, [showElectionRadio, totalClaimedData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      setClaimedIncomeByDelegate(
        newDataFormatByDelegateAcrossElections(
          claimedAndUnclaimedData?.historic_incomes || [],
          true
        )
      )
  }, [showElectionRadio, claimedAndUnclaimedData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      showDelegateRadio !== 'allDelegates' &&
      setTotalByCategoryList(
        newDataFormatTotalByCategory(
          incomeCategoriesByElectionAndDelegateData?.transaction_by_category_and_election ||
            []
        )
      )
  }, [
    showElectionRadio,
    showDelegateRadio,
    incomeCategoriesByElectionAndDelegateData
  ])

  return [
    {
      chartTransactionsList,
      typeCurrencySelect,
      electionYearSelect,
      electionRoundSelect,
      showDelegateRadio,
      delegateSelect,
      electionsByYearList,
      showElectionRadio,
      totalByCategoryList,
      percentIncomeList,
      totalClaimedList,
      claimedIncomeByDelegate
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
