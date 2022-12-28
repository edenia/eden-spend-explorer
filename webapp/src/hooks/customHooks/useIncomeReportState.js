import { useEffect, useState } from 'react'

import {
  GET_GENERAL_INCOME,
  GET_DELEGATES_BY_ELECTION_INCOME
} from '../../gql/income.gql'
import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import { newDataFormatByDelegatesIncome } from '../../utils/new-format-objects'
import { useImperativeQuery } from '../../utils'

const useIncomeReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [incomeByElectionsList, setIncomeByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])

  const loadGeneralIncome = useImperativeQuery(GET_GENERAL_INCOME)

  const loadElectionsByYear = useImperativeQuery(GET_ELECTIONS_BY_YEAR)

  const loadDelegatesByElection = useImperativeQuery(
    GET_DELEGATES_BY_ELECTION_INCOME
  )

  useEffect(async () => {
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
  }, [])

  useEffect(async () => {
    if (showElectionRadio === 'allElections') {
      const generalIncomeData = await loadGeneralIncome()

      setIncomeByElectionsList(generalIncomeData.data?.incomeFrontend.data[1])
      setDelegatesList(generalIncomeData.data?.incomeFrontend.data[0])
    } else {
      setDelegatesList([])

      const delegatesByElectionData = await loadDelegatesByElection({
        election: electionRoundSelect
      })

      setDelegatesList(
        newDataFormatByDelegatesIncome(
          delegatesByElectionData.data?.historic_incomes || []
        ) || []
      )
    }
  }, [showElectionRadio, electionRoundSelect])

  useEffect(async () => {
    const electionsByYearData = await loadElectionsByYear({
      minDate: `2021-01-01`,
      maxDate: `${new Date().getFullYear()}-12-31`
    })

    setElectionsByYearList([
      ...electionsByYearList,
      ...electionsByYearData.data?.eden_historic_election
    ])
    setElectionRoundSelect(
      electionsByYearData.data?.eden_historic_election[0].election
    )
    setElectionsByYearList(
      electionsByYearData.data?.eden_historic_election || []
    )
  }, [])

  useEffect(() => {
    const rounds = []
    for (let pos = 0; pos < incomeByElectionsList.length; pos++) {
      const election = Number(
        incomeByElectionsList[pos].election.charAt(
          incomeByElectionsList[pos].election.length - 1
        )
      )
      const newElections = electionsByYearList.filter(
        elec => elec.election === election - 1
      )
      rounds.push(newElections[0])
    }
    setElectionsByYearList(rounds)
    setElectionRoundSelect(rounds[0]?.election)
  }, [incomeByElectionsList])

  return [
    {
      incomeByElectionsList,
      electionsByYearList,
      delegatesList,
      electionRoundSelect,
      showElectionRadio
    },
    {
      setElectionRoundSelect,
      setShowElectionRadio
    }
  ]
}

export default useIncomeReportState
