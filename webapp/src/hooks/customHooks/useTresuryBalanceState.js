import { useEffect, useState } from 'react'

import { useSharedState } from '../../context/state.context'
import { eosApi } from '../../utils/eosapi'
import { sleep } from '../../utils/sleep'
import { mainConfig } from '../../config'

const getActualDate = () => {
  const date = new Date()

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const useTresuryBalanceState = () => {
  const [state] = useSharedState()
  const [eosRate, setEosRate] = useState()
  const [currencyBalance, setCurrencyBalance] = useState('Loading... ')
  const [nextEdenDisbursement, setNextEdenDisbursement] = useState('')
  const [delegateBalance, setDelegateBalance] = useState('Loading...')

  const getEosBalance = async account => {
    try {
      const response = await eosApi.getCurrencyBalance(
        'eosio.token',
        account,
        'EOS'
      )

      return response[0]
    } catch (error) {
      console.log(error)
      await sleep(60)
      getEosBalance(account)
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
      const date = new Date(response?.rows[0][1]?.distribution_time)

      setNextEdenDisbursement(date)
    } catch (error) {
      console.log(error)
      await sleep(10)
      getNextEdenDisbursement()
    }
  }

  useEffect(async () => {
    getEosRate()
    setCurrencyBalance((await getEosBalance(mainConfig.edenContract)) || '')
    getNextEdenDisbursement()
  }, [])

  useEffect(async () => {
    if (state?.user?.accountName)
      setDelegateBalance((await getEosBalance(state?.user?.accountName)) || '')
  }, [state?.user?.accountName])

  return [{ eosRate, currencyBalance, nextEdenDisbursement, delegateBalance }]
}

export default useTresuryBalanceState
