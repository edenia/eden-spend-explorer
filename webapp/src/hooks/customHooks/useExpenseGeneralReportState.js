import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_PERCENT_ALL_ELECTIONS,
  GET_PERCENT_BY_ELECTION,
  GET_EXPENSE_BY_ELECTIONS,
  GET_TOTAL_EXPENSE_BY_DELEGATE,
  GET_DELEGATES_BY_ELECTION,
  GET_TOTAL_BY_CATEGORY_AND_ELECTION,
  GET_TOTAL_BY_CATEGORY
} from '../../gql/expenseGeneral.gql'

const useExpenseGeneralReportState = () => {
  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [expenseByElectionsList, setExpenseByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [percentExpenseList, setPercentExpenseList] = useState([])

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadTotalExpenseByDelegate, { data: totalExpenseByDelegateData }] =
    useLazyQuery(GET_TOTAL_EXPENSE_BY_DELEGATE)

  const [loadExpenseByElections, { data: expenseByElectionsData }] =
    useLazyQuery(GET_EXPENSE_BY_ELECTIONS)

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

  const [loadDelegatesByElection, { data: delegatesByElectionData }] =
    useLazyQuery(GET_DELEGATES_BY_ELECTION, {
      variables: {
        election: electionRoundSelect
      }
    })

  const [loadPercentAllElections, { data: percentAllElectionData }] =
    useLazyQuery(GET_PERCENT_ALL_ELECTIONS)

  const [loadPercentByElection, { data: percentByElectionData }] = useLazyQuery(
    GET_PERCENT_BY_ELECTION,
    {
      variables: {
        election: electionRoundSelect
      }
    }
  )

  const [loadTotalByCategory, { data: totalByCategoryData }] = useLazyQuery(
    GET_TOTAL_BY_CATEGORY
  )

  const [
    loadTotalByCategoryAndElection,
    { data: totalByCategoryAndElectionData }
  ] = useLazyQuery(GET_TOTAL_BY_CATEGORY_AND_ELECTION, {
    variables: {
      election: electionRoundSelect
    }
  })

  useEffect(() => {
    loadTotalByCategoryAndElection()
    loadTotalExpenseByDelegate()
    loadPercentAllElections()
    loadDelegatesByElection()
    loadExpenseByElections()
    loadPercentByElection()
    loadElectionsByYear()
    loadTotalByCategory()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setExpenseByElectionsList(
      newDataFormatByElections(
        expenseByElectionsData?.total_by_category_and_election || []
      )
    )
  }, [expenseByElectionsData])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setDelegatesList(
        newDataFormatByDelegates(
          totalExpenseByDelegateData?.expenses_by_delegate || []
        )
      )
  }, [showElectionRadio, totalExpenseByDelegateData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      setDelegatesList(
        newDataFormatByDelegates(
          delegatesByElectionData?.historic_expenses || []
        )
      )
  }, [showElectionRadio, delegatesByElectionData])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setPercentExpenseList(
        newDataFormatPercentAllElections(
          percentAllElectionData?.percent_by_all_elections_incomes || [],
          'categorized'
        )
      )
  }, [showElectionRadio, percentAllElectionData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      setPercentExpenseList(
        newDataFormatPercentByElection(
          percentByElectionData?.percent_by_delegates_incomes || [],
          'categorized'
        )
      )
  }, [showElectionRadio, percentByElectionData])

  return [
    {
      expenseByElectionsList,
      electionsByYearList,
      percentExpenseList,
      delegatesList,
      categoryList,
      electionRoundSelect,
      typeCurrencySelect,
      electionYearSelect,
      showElectionRadio
    },
    {
      setElectionRoundSelect,
      setTypeCurrencySelect,
      setElectionYearSelect,
      getListElectionYears,
      setShowElectionRadio
    }
  ]
}

export default useExpenseGeneralReportState
