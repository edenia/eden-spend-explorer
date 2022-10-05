import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { eosApi } from '../../utils/eosapi'
import { mainConfig } from '../../config'
import {
  GET_INCOME_TRANSACTIONS_DELEGATES_QUERY,
  GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_TOTAL_INCOME_BY_ELECTIONS_QUERY,
  GET_ELECTIONS_BY_YEAR,
  GET_INCOMES_CLAIMED_AND_UNCLAIMED_BY_ELECTION,
  GET_TOTAL_CLAIMED_AND_UNCLAIMED,
  GET_TOTAL_CLAIMED_AND_UNCLAIMED_BY_ELECTION,
  GET_PERCENT_ALL_ELECTIONS,
  GET_PERCENT_BY_ELECTIONS,
  GET_PERCENT_BY_DELEGATES
} from '../../gql'
import { listChartColors } from '../../constants'

let CURRENT_GRAPHIC_COLOR = 0

const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

const sortDescList = (a, b) => {
  if (a.EOS > b.EOS) return -1

  if (a.EOS < b.EOS) return 1

  return 0
}

const getActualDate = () => {
  const date = new Date()

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const useIncomeReportState = () => {
  const [currencyBalance, setCurrencyBalance] = useState('')

  const [nextEdenDisbursement, setNextEdenDisbursement] = useState('')

  const [eosRate, setEosRate] = useState(0)

  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')

  const [electionYearSelect, setElectionYearSelect] = useState('All')

  const [electionRoundSelect, setElectionRoundSelect] = useState(0)

  const [delegateSelect, setDelegateSelect] = useState('')

  const [showDelegateRadio, setShowDelegateRadio] = useState('allDelegates')

  const [showElectionRadio, setShowElectionRadio] = useState('allElections')

  const [electionsByYearList, setElectionsByYearList] = useState([])

  const [chartTransactionsList, setChartTransactionsList] = useState([])

  const [incomeByAllDelegatesList, setIncomeByAllDelegatesList] = useState([])

  const [incomeByDelegateAccountList, setIncomeByDelegateAccountList] =
    useState([])

  const [incomeClaimedAndUnclaimedList, setIncomeClaimedAndUnclaimedList] =
    useState([])

  const [totalClaimedAndUnclaimedList, setTotalClaimedAndUnclaimedList] =
    useState([])

  const [percentIncomeList, setPercentIncomeList] = useState([])

  const getEosBalance = async () => {
    try {
      const response = await eosApi.getCurrencyBalance(
        'eosio.token',
        mainConfig.edenContract,
        'EOS'
      )

      setCurrencyBalance(response[0] || '')
    } catch (error) {
      console.log(error)
    }
  }

  const getNextEdenDisbursement = async () => {
    try {
      const response = await eosApi.getTableRows({
        json: true,
        code: mainConfig.edenContract,
        scope: 0,
        table: 'distribution'
      })
      const date = new Date(
        response?.rows[0][1]?.distribution_time
      ).toLocaleDateString()

      setNextEdenDisbursement(date)
    } catch (error) {
      console.log(error)
    }
  }

  const getEosRate = async () => {
    try {
      const response = await fetch(
        `${
          mainConfig.eosRate
        }/coins/eos/history?date=${getActualDate()}&localization=false`,
        {
          method: 'GET',
          redirect: 'follow'
        }
      )
      const data = await response.json()

      setEosRate(data.market_data.current_price.usd)
    } catch (error) {
      console.log(error)
    }
  }

  const thousandSeparator = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const newDataFormatByElection = electionsList => {
    const newFormatData = electionsList.map(data => ({
      name: `Election ${data.election + 1}`,
      EOS: Number(data.amount).toFixed(2),
      USD: Number(data.usd_total).toFixed(2),
      color: generateColor()
    }))

    setChartTransactionsList(newFormatData)
  }

  const newDataFormatByAllDelegates = transactionsList => {
    const newFormatData = transactionsList.map(data => ({
      name: data.eden_delegate.account,
      EOS: Number(
        data.eden_transactions_aggregate.aggregate.sum.amount.toFixed(2)
      ),
      USD: Number(
        data.eden_transactions_aggregate.aggregate.sum.usd_total.toFixed(2)
      ),
      EXCHANGE_RATE: Number(
        data.eden_transactions_aggregate.aggregate.avg.eos_exchange.toFixed(2)
      ),
      color: generateColor(),
      level: data.delegate_level,
      link: false
    }))

    setChartTransactionsList(newFormatData.sort(sortDescList))
  }

  const newDataFormatByDelegate = transactionsList => {
    const newFormatData = transactionsList.map(data => ({
      name: delegateSelect,
      EOS: Number(data.amount.toFixed(2)),
      USD: Number(data.usd_total.toFixed(2)),
      EXCHANGE_RATE: Number(data.eos_exchange.toFixed(2)),
      date: new Date(data.date).toLocaleDateString(),
      color: generateColor(),
      level: data.eden_election.delegate_level,
      txId: data.txid,
      category: data.category
    }))

    setChartTransactionsList(newFormatData)
  }

  const newDataFormatClaimedAndUnclaimedByElection =
    claimedAndUnclaimedData => {
      const newFormatData = claimedAndUnclaimedData.map(data => ({
        name: data.recipient,
        EOS_UNCLAIMED: Number(data.eos_unclaimed.toFixed(2)),
        USD_UNCLAIMED: Number(data.usd_unclaimed.toFixed(2)),
        EOS_CLAIMED: Number(data.eos_claimed.toFixed(2)),
        USD_CLAIMED: Number(data.usd_claimed.toFixed(2)),
        EXCHANGE_RATE: Number(data.exchange_rate.toFixed(2))
      }))

      setIncomeClaimedAndUnclaimedList(newFormatData)
    }

  const newDataFormatTotalClaimedAndUnclaimed =
    totalClaimedAndUnclaimedData => {
      const newFormatData = totalClaimedAndUnclaimedData.map(data => ({
        name: data.category,
        EOS: Number(data.amount.toFixed(2)),
        USD: Number(data.usd_total.toFixed(2))
      }))

      setTotalClaimedAndUnclaimedList(newFormatData)
    }

  const newDataFormatPercentAllElections = percentAllElectionData => {
    const newFormatData = percentAllElectionData.map(data => ({
      name: `Election ${data.election + 1}`,
      EOS_CLAIMED: Number(data.eos_claimed.toFixed(4)) * 100,
      EOS_UNCLAIMED: Number(data.eos_unclaimed.toFixed(4)) * 100,
      USD_CLAIMED: Number(data.usd_claimed.toFixed(4)) * 100,
      USD_UNCLAIMED: Number(data.usd_unclaimed.toFixed(4)) * 100
    }))

    setPercentIncomeList(newFormatData)
  }

  const newDataFormatPercentByElection = percentByElectionData => {
    const newFormatData = percentByElectionData.map(data => ({
      name: data.recipient,
      election: data.election,
      EOS_CLAIMED: Number(data.eos_claimed.toFixed(4)) * 100,
      EOS_UNCLAIMED: Number(data.eos_unclaimed.toFixed(4)) * 100,
      USD_CLAIMED: Number(data.usd_claimed.toFixed(4)) * 100,
      USD_UNCLAIMED: Number(data.usd_unclaimed.toFixed(4)) * 100
    }))

    setPercentIncomeList(newFormatData)
  }

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadTotalIncomeByElection, { data: totalIncomeByElectionData }] =
    useLazyQuery(GET_TOTAL_INCOME_BY_ELECTIONS_QUERY)

  const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
    GET_ELECTIONS_BY_YEAR,
    {
      variables:
        electionYearSelect === 'All'
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

  const [loadIncomeByAllDelegates, { data: icomeByAllDelegatesData }] =
    useLazyQuery(GET_INCOME_TRANSACTIONS_DELEGATES_QUERY, {
      variables: { election: electionRoundSelect }
    })

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

  const [loadTotalClaimedAndUnclaimed, { data: totalClaimedAndUnclaimedData }] =
    useLazyQuery(GET_TOTAL_CLAIMED_AND_UNCLAIMED)

  const [
    loadTotalClaimedAndUnclaimedByElection,
    { data: totalClaimedAndUnclaimedByElectionData }
  ] = useLazyQuery(GET_TOTAL_CLAIMED_AND_UNCLAIMED_BY_ELECTION, {
    variables: {
      election: electionRoundSelect
    }
  })

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

  const [loadPercentByDelegate, { data: percentByDelegateData }] = useLazyQuery(
    GET_PERCENT_BY_DELEGATES,
    {
      variables: {
        election: electionRoundSelect,
        delegate: delegateSelect
      }
    }
  )

  useEffect(() => {
    getEosRate()
    getEosBalance()
    getNextEdenDisbursement()
    loadElectionsByYear()
    loadIncomeByAllDelegates()
    loadIncomeByDelegateAccount()
    loadTotalIncomeByElection()
    loadClaimedAndUnclaimedByElection()
    loadTotalClaimedAndUnclaimed()
    loadTotalClaimedAndUnclaimedByElection()
    loadPercentAllElections()
    loadPercentByElection()
    loadPercentByDelegate()
  }, [])

  useEffect(() => {
    if (electionsByYearData?.eden_historic_election[0]) {
      setElectionsByYearList([
        ...electionsByYearList,
        ...electionsByYearData.eden_historic_election
      ])

      setElectionRoundSelect(
        electionsByYearData.eden_historic_election[0]?.election
      )

      setElectionsByYearList(electionsByYearData.eden_historic_election)
    }

    if (electionsByYearList[0]?.election !== electionRoundSelect) {
      setIncomeByAllDelegatesList([])
      setIncomeByDelegateAccountList([])
      setDelegateSelect('')
    }
  }, [electionsByYearData])

  useEffect(() => {
    if (icomeByAllDelegatesData?.eden_election) {
      setIncomeByAllDelegatesList(icomeByAllDelegatesData.eden_election)
      setDelegateSelect(
        icomeByAllDelegatesData.eden_election[0]?.eden_delegate.account
      )
    }

    if (!icomeByAllDelegatesData?.eden_election[0]) {
      setIncomeByAllDelegatesList([])
      setDelegateSelect('')
    }
  }, [icomeByAllDelegatesData])

  useEffect(() => {
    incomeByAccountData?.eden_transaction
      ? setIncomeByDelegateAccountList(incomeByAccountData.eden_transaction)
      : setIncomeByDelegateAccountList([])
  }, [incomeByAccountData])

  useEffect(() => {
    claimedAndUnclaimedData?.historic_incomes &&
      newDataFormatClaimedAndUnclaimedByElection(
        claimedAndUnclaimedData.historic_incomes
      )
  }, [claimedAndUnclaimedData])

  useEffect(() => {
    if (showElectionRadio === 'allElections') {
      totalClaimedAndUnclaimedData?.total_claimed_and_unclaimed &&
        newDataFormatTotalClaimedAndUnclaimed(
          totalClaimedAndUnclaimedData.total_claimed_and_unclaimed
        )
    } else {
      totalClaimedAndUnclaimedByElectionData?.total_claimed_and_unclaimed_by_election &&
        newDataFormatTotalClaimedAndUnclaimed(
          totalClaimedAndUnclaimedByElectionData?.total_claimed_and_unclaimed_by_election
        )
    }
  }, [
    showElectionRadio,
    totalClaimedAndUnclaimedData,
    totalClaimedAndUnclaimedByElectionData
  ])

  useEffect(() => {
    if (showElectionRadio === 'allElections') {
      percentAllElectionData?.percent_by_all_elections &&
        newDataFormatPercentAllElections(
          percentAllElectionData.percent_by_all_elections
        )
    } else {
      showDelegateRadio === 'allDelegates'
        ? percentByElectionData?.percent_by_delegates &&
          newDataFormatPercentByElection(
            percentByElectionData.percent_by_delegates
          )
        : percentByDelegateData?.percent_by_delegates &&
          newDataFormatPercentByElection(
            percentByDelegateData.percent_by_delegates
          )
    }
  }, [
    showElectionRadio,
    showDelegateRadio,
    percentAllElectionData,
    percentByElectionData,
    percentByDelegateData
  ])

  useEffect(() => {
    if (showElectionRadio === 'allElections') {
      totalIncomeByElectionData?.total_income_by_election[0] &&
        newDataFormatByElection(
          totalIncomeByElectionData.total_income_by_election
        )
    } else {
      showDelegateRadio === 'allDelegates'
        ? newDataFormatByAllDelegates(incomeByAllDelegatesList)
        : newDataFormatByDelegate(incomeByDelegateAccountList)
    }
  }, [
    showElectionRadio,
    totalIncomeByElectionData,
    showDelegateRadio,
    incomeByDelegateAccountList,
    incomeByAllDelegatesList
  ])

  return [
    {
      currencyBalance,
      eosRate,
      chartTransactionsList,
      typeCurrencySelect,
      electionYearSelect,
      electionRoundSelect,
      showDelegateRadio,
      delegateSelect,
      incomeByAllDelegatesList,
      electionsByYearList,
      nextEdenDisbursement,
      showElectionRadio,
      incomeClaimedAndUnclaimedList,
      totalClaimedAndUnclaimedList,
      percentIncomeList
    },
    {
      setTypeCurrencySelect,
      getListElectionYears,
      setElectionYearSelect,
      setElectionRoundSelect,
      setShowDelegateRadio,
      setDelegateSelect,
      thousandSeparator,
      setShowElectionRadio
    }
  ]
}

export default useIncomeReportState
