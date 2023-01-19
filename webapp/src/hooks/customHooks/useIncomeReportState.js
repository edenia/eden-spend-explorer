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
  newDataFormatByTreasuryList,
  eosApi,
  sleep
} from '../../utils'
import { mainConfig } from '../../config'
import { useSharedState } from '../../context/state.context'

const getNextEdenDisbursement = async () => {
  try {
    const response = await eosApi.getTableRows({
      json: true,
      code: mainConfig.edenContract,
      scope: 0,
      table: 'distribution'
    })
    const date = new Date(response?.rows[0][1]?.distribution_time)

    return date
  } catch (error) {
    console.log(error)
    await sleep(10)
    getNextEdenDisbursement()
  }
}

const useIncomeReportState = () => {
  const [state] = useSharedState()
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

    setElectionRoundSelect(electionsData.eden_election[0]?.election)

    setelectionsList(electionsData.eden_election || [])

    setIncomeByElectionsList(
      newDataIncomeFormatByAllElections(incomeByElections.data || [])
    )
  }, [])

  useEffect(async () => {
    const { data: treasuryData } = await loadTreasuryBalance()

    const nextEdenDisbursement = await getNextEdenDisbursement()

    const { eosRate } = state.eosTrasuryBalance
    const treasuryBalance = Number(
      state?.eosTrasuryBalance?.currencyBalance.split(' ')[0]
    )
    const totalNextMonthDistribution = treasuryBalance * 0.11 || 0
    const estimatedTreasury = treasuryBalance - totalNextMonthDistribution

    const usdEstimatedTreasury =
      (treasuryBalance - totalNextMonthDistribution) * eosRate

    setTreasuryList(
      newDataFormatByTreasuryList(
        treasuryData.eden_treasury,
        nextEdenDisbursement,
        estimatedTreasury,
        usdEstimatedTreasury
      )
    )
  }, [state.eosTrasuryBalance.currencyBalance])

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
