import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/income.gql'
import {
  GET_TOTAL_INCOME_BY_DELEGATE,
  GET_DELEGATES_BY_ELECTION,
  GET_INCOME_BY_ELECTIONS
} from '../../gql/incomeGeneral.gql'
import {
  newDataFormatByElections,
  newDataFormatByDelegates
} from '../../utils/new-format-objects'

const useIncomeGeneralReportState = () => {
  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [incomeByElectionsList, setIncomeByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])

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
    useLazyQuery(GET_DELEGATES_BY_ELECTION, {
      variables: {
        election: electionRoundSelect
      }
    })

  useEffect(() => {
    loadTotalIncomeByDelegate()
    loadDelegatesByElection()
    loadIncomeByElections()
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
      newDataFormatByElections(
        incomeByElectionsData?.total_by_category_and_election || []
      )
    )
  }, [incomeByElectionsData])

  useEffect(() => {
    showElectionRadio === 'All' &&
      setDelegatesList(
        newDataFormatByDelegates(
          totalIncomeByDelegateData?.incomes_by_delegate || []
        )
      )
  }, [showElectionRadio, totalIncomeByDelegateData])

  useEffect(() => {
    showElectionRadio !== 'All' &&
      setDelegatesList(
        newDataFormatByDelegates(
          delegatesByElectionData?.historic_incomes || []
        )
      )
  }, [showElectionRadio, delegatesByElectionData])

  return [
    {
      incomeByElectionsList,
      electionsByYearList,
      delegatesList,
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

export default useIncomeGeneralReportState
