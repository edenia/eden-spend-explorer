import { useEffect, useState } from 'react'

import { mainConfig } from '../../config'
import { eosApi } from '../../utils/eosapi'
import { sleep } from '../../utils/sleep'

const getActualDate = () => {
  const date = new Date()

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const useTresuryBalanceState = () => {
  const [eosRate, setEosRate] = useState(' Loading... ')
  const [currencyBalance, setCurrencyBalance] = useState('Loading... ')
  const [nextEdenDisbursement, setNextEdenDisbursement] = useState('')

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
      await sleep(60)
      getEosBalance()
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
      await sleep(10)
      getEosRate()
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
      await sleep(10)
      getNextEdenDisbursement()
    }
  }

  useEffect(() => {
    getEosRate()
    getEosBalance()
    getNextEdenDisbursement()
  }, [])

  return [{ eosRate, currencyBalance, nextEdenDisbursement }]
}

export default useTresuryBalanceState
