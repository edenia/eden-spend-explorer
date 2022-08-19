import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { eosApi } from '../../utils/eosapi'
import { TRANSACTIONS_QUERY } from '../../gql'

const useIncomeReportState = () => {
  const [currencyBalance, setCurrencyBalance] = useState('')
  const [eosRate, setEosRate] = useState(0)
  const [transactionsList, setTransactionsList] = useState([
    {
      name: 'Test',
      EOS: 590.35
    }
  ])

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
        [txType]: txType === 'EOS' ? data.amount : data.usd_total
      }
    })

    setTransactionsList([
      ...transactionsList,
      newFormatData[0],
      newFormatData[1],
      newFormatData[2]
    ])
  }

  const [load, { loading, data }] = useLazyQuery(TRANSACTIONS_QUERY)

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
