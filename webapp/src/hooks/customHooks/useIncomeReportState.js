import { useEffect, useState } from 'react'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_DELEGATES_BY_ELECTION_INCOME,
  GET_PERCENT_BY_ELECTIONS_INCOME,
  GET_GENERAL_INCOME
} from '../../gql/income.gql'
import {
  newDataFormatByDelegatesIncome,
  newDataFormatPercentByElection
} from '../../utils/new-format-objects'
import { useImperativeQuery } from '../../utils'

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

  const loadGeneralIncome = useImperativeQuery(GET_GENERAL_INCOME)

  const loadElectionsByYear = useImperativeQuery(GET_ELECTIONS_BY_YEAR)

  const loadDelegatesByElection = useImperativeQuery(
    GET_DELEGATES_BY_ELECTION_INCOME
  )

  const loadPercentByElection = useImperativeQuery(
    GET_PERCENT_BY_ELECTIONS_INCOME
  )

  useEffect(async () => {
    const generalIncomeData = await loadGeneralIncome()
    const electionsByYearData = await loadElectionsByYear({
      minDate: `2021-01-01`,
      maxDate: `${new Date().getFullYear()}-12-31`
    })

    setElectionRoundSelect(
      electionsByYearData.data?.eden_historic_election[0].election
    )
    setElectionsByYearList(
      electionsByYearData.data?.eden_historic_election || []
    )

    if (showElectionRadio === 'allElections' && generalIncomeData) {
      setIncomeByElectionsList(generalIncomeData.data?.incomeFrontend.data[2])
      setPercentIncomeList(generalIncomeData.data?.incomeFrontend.data[1])
      setDelegatesList(generalIncomeData.data?.incomeFrontend.data[0])
    }
  }, [showElectionRadio])

  useEffect(async () => {
    if (showElectionRadio === 'oneElection') {
      const delegatesByElectionData = await loadDelegatesByElection({
        election: electionRoundSelect
      })
      const percentByElectionData = await loadPercentByElection({
        election: electionRoundSelect
      })

      setDelegatesList(
        newDataFormatByDelegatesIncome(
          delegatesByElectionData.data?.historic_incomes || []
        ) || []
      )

      setPercentIncomeList(
        newDataFormatPercentByElection(
          percentByElectionData.data?.percent_by_delegates_incomes || [],
          'claimed'
        ) || []
      )
    }
  }, [electionRoundSelect, showElectionRadio])

  useEffect(async () => {
    let electionsByYearData

    if (electionYearSelect === 'All' || electionYearSelect === 'Todos') {
      electionsByYearData = await loadElectionsByYear({
        minDate: `2021-01-01`,
        maxDate: `${new Date().getFullYear()}-12-31`
      })
    } else if (electionYearSelect) {
      electionsByYearData = await loadElectionsByYear({
        minDate: `${electionYearSelect}-01-01`,
        maxDate: `${electionYearSelect}-12-31`
      })
    }

    setElectionRoundSelect(
      electionsByYearData.data?.eden_historic_election[0].election
    )
    setElectionsByYearList(
      electionsByYearData.data?.eden_historic_election || []
    )
  }, [electionYearSelect])

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
