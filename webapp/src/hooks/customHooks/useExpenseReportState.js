import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import {
  GET_EXPENSE_ELECTIONS_BY_YEAR,
  GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY,
  GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY
} from '../../gql'

const useExpenseReport = () => {
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [showDelegateRadio, setShowDelegateRadio] = useState('allDelegates')
  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionRoundSelect, setElectionRoundSelect] = useState()
  const [showEosRateSwitch, setShowEosRateSwitch] = useState(true)
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [incomeByAllDelegatesList, setIncomeByAllDelegatesList] = useState([])
  const [incomeByDelegateAccountList, setIncomeByDelegateAccountList] =
    useState([])

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
    GET_EXPENSE_ELECTIONS_BY_YEAR,
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

  const [loadIncomeByAllDelegates, { data: icomeByAllDelegatesData }] =
    useLazyQuery(GET_EXPENSE_TRANSACTIONS_BY_ALL_ACCOUNTS_QUERY, {
      variables: { election: electionRoundSelect }
    })

  const [loadIncomeByDelegateAccount, { data: incomeByAccountData }] =
    useLazyQuery(GET_EXPENSE_TRANSACTIONS_BY_ACCOUNT_QUERY, {
      variables: {
        election: electionRoundSelect,
        account: delegateSelect
      }
    })

  useEffect(() => {
    loadElectionsByYear()
    loadIncomeByAllDelegates()
    loadIncomeByDelegateAccount()
  }, [])

  useEffect(() => {
    setElectionRoundSelect(
      electionsByYearData?.eden_historic_election[0]?.election
    )
    setElectionsByYearList(electionsByYearData?.eden_historic_election)
  }, [electionsByYearData])

  useEffect(() => {
    setIncomeByAllDelegatesList(icomeByAllDelegatesData?.eden_election)
  }, [icomeByAllDelegatesData])

  useEffect(() => {
    setIncomeByDelegateAccountList(incomeByAccountData?.eden_transaction)
    console.log(incomeByDelegateAccountList)
  }, [incomeByAccountData])

  return [
    {
      showElectionRadio,
      showDelegateRadio,
      typeCurrencySelect,
      showEosRateSwitch,
      electionYearSelect,
      delegateSelect,
      electionRoundSelect,
      electionsByYearList,
      incomeByAllDelegatesList
    },
    {
      setShowElectionRadio,
      setShowDelegateRadio,
      setTypeCurrencySelect,
      setShowEosRateSwitch,
      setElectionYearSelect,
      setDelegateSelect,
      setElectionRoundSelect,
      getListElectionYears
    }
  ]
}

export default useExpenseReport
