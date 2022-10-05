import { useEffect, useState } from 'react'

const useExpenseReport = () => {
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [showDelegateRadio, setShowDelegateRadio] = useState('allDelegates')
  const [typeCurrencySelect, setTypeCurrencySelect] = useState('EOS')
  const [electionYearSelect, setElectionYearSelect] = useState('All')
  const [delegateSelect, setDelegateSelect] = useState('')
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showEosRateSwitch, setShowEosRateSwitch] = useState(true)
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [incomeByAllDelegatesList, setIncomeByAllDelegatesList] = useState([])

  const getListElectionYears = () => {
    const yearsList = ['All']
    const yearCurrent = new Date().getFullYear()
    for (let index = 2021; index <= yearCurrent; index++) {
      yearsList.push(index)
    }

    return yearsList
  }

  useEffect(() => {
    setElectionsByYearList([])
    setIncomeByAllDelegatesList([])
  }, [])

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
