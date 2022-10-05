import { useEffect, useState } from 'react'

import { mainConfig } from '../../config'
import { eosApi } from '../../utils/eosapi'

const getActualDate = () => {
  const date = new Date()

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const useTresuryBalanceState = () => {
  const [currencyBalance, setCurrencyBalance] = useState('')

  const [eosRate, setEosRate] = useState(0)

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

  useEffect(() => {
    getEosRate()
    getEosBalance()
  }, [])

  return [{ eosRate, currencyBalance }]
}

export default useTresuryBalanceState
