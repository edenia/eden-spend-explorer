import { useEffect, useState } from 'react'

import {
  GET_ELECTIONS,
  GET_TOTAL_INCOME_BY_DELEGATE,
  GET_TOTAL_INCOME_BY_ALL_ELECTIONS,
  GET_TOTAL_DELEGATE_INCOME_BY_ELECTION
} from '../../gql'
import {
  useImperativeQuery,
  newDataFormatByDelegatesIncome,
  newDataIncomeFormatByAllElections
} from '../../utils'

const useIncomeReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [electionsList, setelectionsList] = useState([])
  const [incomeByElectionsList, setIncomeByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])

  const loadIncomeByElections = useImperativeQuery(
    GET_TOTAL_INCOME_BY_ALL_ELECTIONS
  )
  // TODO: DELETE THIS const loadGeneralIncome = useImperativeQuery(GET_GENERAL_INCOME)
  const loadElections = useImperativeQuery(GET_ELECTIONS)
  const loadDelegateIncomesByElection = useImperativeQuery(
    GET_TOTAL_DELEGATE_INCOME_BY_ELECTION
  )
  const loadIncomesByDelegate = useImperativeQuery(GET_TOTAL_INCOME_BY_DELEGATE)

  useEffect(async () => {
    const incomeByElections = await loadIncomeByElections()
    const { data: electionsData } = await loadElections()

    setElectionRoundSelect(electionsData.eden_election[0]?.election)
    setelectionsList(electionsData.eden_election || [])
    setIncomeByElectionsList(
      newDataIncomeFormatByAllElections(incomeByElections.data || [])
    )
  }, [])

  useEffect(async () => {
    if (showElectionRadio === 'allElections') {
      const totalIncomeByDelegateData = await loadIncomesByDelegate()

      setDelegatesList(
        newDataFormatByDelegatesIncome(
          totalIncomeByDelegateData.data?.incomes_by_delegate || []
        )
      )
    } else {
      setDelegatesList([])

      const delegatesByElectionData = await loadDelegateIncomesByElection({
        where: { election: { _eq: electionRoundSelect } }
      })

      setDelegatesList(
        newDataFormatByDelegatesIncome(
          delegatesByElectionData.data?.historic_incomes || []
        )
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
