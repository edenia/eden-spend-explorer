import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_TOTAL_INCOME_BY_DELEGATE,
  GET_DELEGATES_BY_ELECTION_INCOME,
  GET_PERCENT_ALL_ELECTIONS_INCOME,
  GET_PERCENT_BY_ELECTIONS_INCOME,
  GET_INCOME_BY_ELECTIONS
} from '../../gql/income.gql'
import {
  newDataFormatByElectionsIncome,
  newDataFormatByDelegatesIncome,
  newDataFormatPercentAllElections,
  newDataFormatPercentByElection
} from '../../utils/new-format-objects'

const useIncomeReportState = () => {
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [incomeByElectionsList, setIncomeByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])
  const [percentIncomeList, setPercentIncomeList] = useState([])

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadTotalIncomeByDelegate, { data: totalIncomeByDelegateData }] =
    useLazyQuery(GET_TOTAL_INCOME_BY_DELEGATE)

  const [loadIncomeByElections, { data: incomeByElectionsData }] = useLazyQuery(
    GET_INCOME_BY_ELECTIONS
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

  const [loadDelegatesByElection, { data: delegatesByElectionData }] =
    useLazyQuery(GET_DELEGATES_BY_ELECTION_INCOME, {
      variables: {
        election: electionRoundSelect
      }
    })

  const [loadPercentAllElections, { data: percentAllElectionData }] =
    useLazyQuery(GET_PERCENT_ALL_ELECTIONS_INCOME)

  const [loadPercentByElection, { data: percentByElectionData }] = useLazyQuery(
    GET_PERCENT_BY_ELECTIONS_INCOME,
    {
      variables: {
        election: electionRoundSelect
      }
    }
  )

  useEffect(() => {
    loadTotalIncomeByDelegate()
    loadPercentAllElections()
    loadDelegatesByElection()
    loadIncomeByElections()
    loadPercentByElection()
    loadElectionsByYear()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0].election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  }, [electionsByYearData])

  useEffect(() => {
    setIncomeByElectionsList(
      newDataFormatByElectionsIncome(
        incomeByElectionsData?.total_by_category_and_election || []
      ) || []
    )
  }, [incomeByElectionsData])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setDelegatesList(
        newDataFormatByDelegatesIncome(
          totalIncomeByDelegateData?.incomes_by_delegate || []
        ) || []
      )
  }, [showElectionRadio, totalIncomeByDelegateData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      setDelegatesList(
        newDataFormatByDelegatesIncome(
          delegatesByElectionData?.historic_incomes || []
        ) || []
      )
  }, [showElectionRadio, delegatesByElectionData])

  useEffect(() => {
    showElectionRadio === 'allElections' &&
      setPercentIncomeList(
        newDataFormatPercentAllElections(
          percentAllElectionData?.percent_by_all_elections_incomes || [],
          'claimed'
        ) || []
      )
  }, [showElectionRadio, percentAllElectionData])

  useEffect(() => {
    showElectionRadio !== 'allElections' &&
      setPercentIncomeList(
        newDataFormatPercentByElection(
          percentByElectionData?.percent_by_delegates_incomes || [],
          'claimed'
        ) || []
      )
  }, [showElectionRadio, percentByElectionData])

  return [
    {
      incomeByElectionsList,
      electionsByYearList,
      percentIncomeList,
      delegatesList,
      electionRoundSelect,
      electionYearSelect,
      showElectionRadio
    },
    {
      setElectionRoundSelect,
      setElectionYearSelect,
      getListElectionYears,
      setShowElectionRadio
    }
  ]
}

export default useIncomeReportState
