import { useEffect, useState } from 'react'

import {
  GET_TREASURY,
  GET_ELECTIONS,
  GET_RANKS_BY_ELECTION,
  GET_TOTAL_INCOME_BY_DELEGATE,
  GET_TOTAL_INCOME_BY_ALL_ELECTIONS,
  GET_TOTAL_DELEGATE_INCOME_BY_ELECTION,
  GET_RANK_LEVELS
} from '../../gql'
import {
  useImperativeQuery,
  newDataFormatByDelegatesIncome,
  newDataIncomeFormatByAllElections,
  newDataFormatByTreasuryList
} from '../../utils'

const useIncomeReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [incomeByElectionsList, setIncomeByElectionsList] = useState([])
  const [electionsList, setelectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])
  const [treasuryList, setTreasuryList] = useState([])
  const [ranksList, setRanksList] = useState([])
  const [delegatesActualElectionList, setDelegatesActualElectionList] =
    useState([])

  const loadIncomesByDelegate = useImperativeQuery(GET_TOTAL_INCOME_BY_DELEGATE)
  const loadRankLevelActualElection = useImperativeQuery(GET_RANK_LEVELS)
  const loadRanksActualElection = useImperativeQuery(GET_RANKS_BY_ELECTION)
  const loadTreasuryBalance = useImperativeQuery(GET_TREASURY)
  const loadElections = useImperativeQuery(GET_ELECTIONS)
  const loadIncomeByElections = useImperativeQuery(
    GET_TOTAL_INCOME_BY_ALL_ELECTIONS
  )
  const loadDelegateIncomesByElection = useImperativeQuery(
    GET_TOTAL_DELEGATE_INCOME_BY_ELECTION
  )

  useEffect(async () => {
    const incomeByElections = await loadIncomeByElections()

    const { data: electionsData } = await loadElections()

    const { data: actualElectionDelegatesData } = await loadRanksActualElection(
      {
        where: {
          election: { _eq: electionsData.eden_election.at(-1)?.election }
        }
      }
    )

    const { data: ranksLevelElectionData } = await loadRankLevelActualElection({
      where: {
        election: { _eq: electionsData.eden_election.at(-1)?.election }
      }
    })

    setDelegatesActualElectionList(
      actualElectionDelegatesData?.eden_election || []
    )

    setRanksList(ranksLevelElectionData.eden_election)

    const { data: treasuryData } = await loadTreasuryBalance()

    setTreasuryList(newDataFormatByTreasuryList(treasuryData.eden_treasury))

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
      treasuryList,
      electionRoundSelect,
      showElectionRadio,
      delegatesActualElectionList,
      ranksList
    },
    {
      setElectionRoundSelect,
      setShowElectionRadio
    }
  ]
}

export default useIncomeReportState
