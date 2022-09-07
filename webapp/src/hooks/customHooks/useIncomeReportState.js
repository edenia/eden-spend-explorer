import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { eosApi } from '../../utils/eosapi'
import { mainConfig } from '../../config'
import {
  GET_INCOME_TRANSACTIONS_DELEGATES_QUERY,
  GET_INCOME_TRANSACTIONS_BY_ACCOUNT_QUERY,
  GET_ELECTIONS_BY_YEAR
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
  const [electionYearSelect, setElectionYearSelect] = useState(2021)
  const [electionRoundSelect, setElectionRoundSelect] = useState('')
  const [delegateSelect, setDelegateSelect] = useState('')
  const [showDelegateRadio, setShowDelegateRadio] = useState('allDelegates')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [chartTransactionsList, setChartTransactionsList] = useState([])
  const [incomeByAllDelegatesList, setIncomeByAllDelegatesList] = useState([])
  const [incomeByDelegateAccountList, setIncomeByDelegateAccountList] =
    useState([])

  const getEosBalance = async () => {
    const response = eosApi.getCurrencyBalance(
      'eosio.token',
      'genesis.eden',
      'EOS'
    )
    const data = await response

    setCurrencyBalance(data[0])
  }

  const getNextEdenDisbursement = async () => {
    const response = eosApi.getTableRows({
      json: true,
      code: 'genesis.eden',
      scope: 0,
      table: 'distribution'
    })
    const data = await response
    const date = new Date(
      data?.rows[0][1]?.distribution_time
    ).toLocaleDateString()

    setNextEdenDisbursement(date)
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

  const newDataFormatByAllDelegates = transactionsList => {
    const newFormatData = transactionsList.map(data => {
      return {
        name: data.eden_delegate.account,
        EOS: data.eden_transactions_aggregate.aggregate.sum.amount,
        USD: data.eden_transactions_aggregate.aggregate.sum.usd_total,
        color: generateColor(),
        level: data.delegate_level
      }
    })

    setChartTransactionsList(newFormatData.sort(sortDescList))
  }

  const newDataFormatByDelegate = transactionsList => {
    const newFormatData = transactionsList.map((data, index) => {
      return {
        name: `${delegateSelect}_${index}`,
        EOS: data.amount,
        USD: data.usd_total,
        color: generateColor(),
        level: data.eden_election.delegate_level
      }
    })
    setChartTransactionsList(newFormatData)
  }

  const getListElectionYears = () => {
    const yearsList = []
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
    GET_ELECTIONS_BY_YEAR,
    {
      variables: {
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

  useEffect(() => {
    getEosRate()
    getEosBalance()
    getNextEdenDisbursement()
    loadElectionsByYear()
    loadIncomeByAllDelegates()
    loadIncomeByDelegateAccount()
  }, [])

  useEffect(() => {
    if (electionsByYearData?.eden_historic_election) {
      setElectionRoundSelect(
        electionsByYearData.eden_historic_election[0]?.election_round
      )
      setElectionsByYearList(electionsByYearData.eden_historic_election)
    }

    if (!electionsByYearData?.eden_historic_election[0]) {
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
    showDelegateRadio === 'allDelegates'
      ? newDataFormatByAllDelegates(incomeByAllDelegatesList)
      : newDataFormatByDelegate(incomeByDelegateAccountList)
  }, [showDelegateRadio, incomeByDelegateAccountList, incomeByAllDelegatesList])

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
      nextEdenDisbursement
    },
    {
      setTypeCurrencySelect,
      getListElectionYears,
      setElectionYearSelect,
      setElectionRoundSelect,
      setShowDelegateRadio,
      setDelegateSelect
    }
  ]
}

export default useIncomeReportState
