import { useEffect, useState } from 'react'

import {
  GET_ELECTIONS,
  GET_GENERAL_INCOME,
  GET_DELEGATES_BY_ELECTION_INCOME
} from '../../gql'
import { useImperativeQuery, newDataFormatByDelegatesIncome } from '../../utils'

const useIncomeReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('')
  const [electionsList, setelectionsList] = useState([])
  const [incomeByElectionsList, setIncomeByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])

  const loadGeneralIncome = useImperativeQuery(GET_GENERAL_INCOME)
  const loadElections = useImperativeQuery(GET_ELECTIONS)
  const loadDelegatesByElection = useImperativeQuery(
    GET_DELEGATES_BY_ELECTION_INCOME
  )

  useEffect(async () => {
    const { data: electionsData } = await loadElections()

    setElectionRoundSelect(electionsData.eden_election[0]?.election)
    setelectionsList(electionsData.eden_election || [])
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

  return [
    {
      incomeByElectionsList,
      electionsList,
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
