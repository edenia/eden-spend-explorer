import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { eosApi } from '../../utils/eosapi'
import { INCOME_TRANSACTIONS_BY_DELEGATE_QUERY } from '../../gql'

const useIncomeReportState = () => {
  const [currencyBalance, setCurrencyBalance] = useState('')
  const [eosRate, setEosRate] = useState(0)
  const [transactionsList, setTransactionsList] = useState()

  const getBalance = async () => {
    const response = eosApi.getCurrencyBalance(
      'eosio.token',
      'genesis.eden',
      'EOS'
    )
    const data = await response

    setCurrencyBalance(data[0])
  }

  const getEosRate = async () => {
    try {
      const date = new Date()
      const actualDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/eos/history?date=${actualDate}&localization=false`,
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

  const handleChartDataTransaction = (txType, txList) => {
    const newFormatData = txList.map(data => {
      return {
        name: data.eden_election.eden_delegate.account,
        [txType]:
          txType === 'EOS'
            ? data.eden_election.eden_transactions_aggregate.aggregate.sum
                .amount
            : data.eden_election.eden_transactions_aggregate.aggregate.sum
                .usd_total
      }
    })

    setTransactionsList(newFormatData)
  }

  const [load, { loading, data }] = useLazyQuery(
    INCOME_TRANSACTIONS_BY_DELEGATE_QUERY
  )

  useEffect(() => {
    getEosRate()
    getBalance()
    load()
  }, [])

  useEffect(() => {
    data?.eden_transaction &&
      handleChartDataTransaction('EOS', data.eden_transaction)
  }, [data])
  console.log(loading)

  return [
    { currencyBalance, eosRate, transactionsList }, // state
    { handleChartDataTransaction } // callback
  ]
}

export default useIncomeReportState
