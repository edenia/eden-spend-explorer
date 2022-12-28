import { useEffect, useState } from 'react'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_PERCENT_ALL_ELECTIONS_EXPENSE,
  GET_EXPENSE_BY_ELECTIONS,
  GET_TOTAL_EXPENSE_BY_DELEGATE,
  GET_DELEGATES_BY_ELECTION_EXPENSE,
  GET_TOTAL_BY_CATEGORY_AND_ELECTION_EXPENSE,
  GET_TOTAL_BY_CATEGORY_EXPENSE
} from '../../gql/expense.gql'
import {
  newDataFormatByCategorizedElectionsExpense,
  newDataFormatByAllDelegatesExpense,
  newDataFormatByElectionAndDelegateExpense,
  newDataFormatPercentAllElections,
  newDataFormatTotalByCategoryExpense
} from '../../utils/new-format-objects'
import { useImperativeQuery } from '../../utils'

const useExpenseReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [electionsByYearList, setElectionsByYearList] = useState([])
  const [expenseByElectionsList, setExpenseByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [percentExpenseList, setPercentExpenseList] = useState([])

  const loadExpenseByElections = useImperativeQuery(GET_EXPENSE_BY_ELECTIONS)
  const loadTotalExpenseByDelegate = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_DELEGATE
  )
  const loadElectionsByYear = useImperativeQuery(GET_ELECTIONS_BY_YEAR)
  const loadDelegatesExpenseByElections = useImperativeQuery(
    GET_DELEGATES_BY_ELECTION_EXPENSE
  )
  const loadPercentAllElections = useImperativeQuery(
    GET_PERCENT_ALL_ELECTIONS_EXPENSE
  )
  const loadTotalByCategory = useImperativeQuery(GET_TOTAL_BY_CATEGORY_EXPENSE)
  const loadTotalByCategoryAndElection = useImperativeQuery(
    GET_TOTAL_BY_CATEGORY_AND_ELECTION_EXPENSE
  )

  useEffect(async () => {
    const expenseByElections = await loadExpenseByElections()
    const electionsByYear = await loadElectionsByYear({
      minDate: `2021-01-01`,
      maxDate: `${new Date().getFullYear()}-12-31`
    })

    // setElectionsByYearList([
    //   ...electionsByYear?.data?.eden_historic_election,
    //   electionsByYearList
    // ])
    setElectionRoundSelect(
      electionsByYear?.data?.eden_historic_election[0]?.election
    )
    setElectionsByYearList(electionsByYear?.data?.eden_historic_election || [])
    setExpenseByElectionsList(
      newDataFormatByCategorizedElectionsExpense(expenseByElections.data || [])
    )
  }, [])

  useEffect(() => {
    const rounds = []
    for (let pos = 0; pos < expenseByElectionsList.length; pos++) {
      const election = Number(
        expenseByElectionsList[pos].election.charAt(
          expenseByElectionsList[pos].election.length - 1
        )
      )
      const newElections = electionsByYearList.filter(
        elec => elec.election === election - 1
      )
      rounds.push(newElections[0])
    }
    setElectionsByYearList(rounds)
    setElectionRoundSelect(rounds[0]?.election)
  }, [expenseByElectionsList])

  useEffect(async () => {
    if (showElectionRadio === 'allElections') {
      const totalExpenseByDelegate = await loadTotalExpenseByDelegate()
      const percentAllElections = await loadPercentAllElections()
      const totalByCategory = await loadTotalByCategory()

      setCategoryList(
        newDataFormatTotalByCategoryExpense(
          totalByCategory?.data?.total_by_category || []
        )
      )
      setPercentExpenseList(
        newDataFormatPercentAllElections(
          percentAllElections?.data?.percent_by_all_elections_expenses || [],
          'categorized'
        )
      )
      setDelegatesList(
        newDataFormatByAllDelegatesExpense(
          totalExpenseByDelegate?.data?.expenses_by_delegate || []
        )
      )
    } else {
      setCategoryList([])
      setDelegatesList([])

      const delegatesExpenseByElections = await loadDelegatesExpenseByElections(
        {
          election: electionRoundSelect
        }
      )
      const totalByCategoryAndElection = await loadTotalByCategoryAndElection({
        election: electionRoundSelect
      })

      setDelegatesList(
        newDataFormatByElectionAndDelegateExpense(
          delegatesExpenseByElections?.data?.historic_expenses || []
        )
      )
      setCategoryList(
        newDataFormatTotalByCategoryExpense(
          totalByCategoryAndElection?.data?.total_by_category_and_election || []
        )
      )
    }
  }, [showElectionRadio, electionRoundSelect])

  return [
    {
      expenseByElectionsList,
      electionsByYearList,
      percentExpenseList,
      delegatesList,
      categoryList,
      electionRoundSelect,
      showElectionRadio
    },
    {
      setElectionRoundSelect,
      setShowElectionRadio
    }
  ]
}

export default useExpenseReportState
