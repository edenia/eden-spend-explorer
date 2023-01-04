import { useEffect, useState } from 'react'

import {
  GET_ELECTIONS,
  GET_TOTAL_EXPENSE_BY_DELEGATE,
  GET_DELEGATES_BY_ELECTION_EXPENSE,
  GET_TOTAL_BY_CATEGORY_AND_ELECTION_EXPENSE,
  GET_TOTAL_BY_CATEGORY_EXPENSE,
  GET_TOTAL_EXPENSE_BY_ALL_ELECTIONS
} from '../../gql'
import {
  newDataExpenseFormatByAllElections,
  newDataFormatByAllDelegatesExpense,
  newDataFormatByElectionAndDelegateExpense,
  newDataFormatTotalByCategoryExpense
} from '../../utils/new-format-objects'
import { useImperativeQuery } from '../../utils'

const useExpenseReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [electionsList, setelectionsList] = useState([])
  const [expenseByElectionsList, setExpenseByElectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  const loadElections = useImperativeQuery(GET_ELECTIONS)
  const loadTotalByCategory = useImperativeQuery(GET_TOTAL_BY_CATEGORY_EXPENSE)
  const loadExpenseByElections = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_ALL_ELECTIONS
  )
  const loadTotalExpenseByDelegate = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_DELEGATE
  )
  const loadDelegatesExpenseByElections = useImperativeQuery(
    GET_DELEGATES_BY_ELECTION_EXPENSE
  )
  const loadTotalByCategoryAndElection = useImperativeQuery(
    GET_TOTAL_BY_CATEGORY_AND_ELECTION_EXPENSE
  )

  useEffect(async () => {
    const expenseByElections = await loadExpenseByElections()
    const { data: electionsData } = await loadElections()

    setElectionRoundSelect(electionsData.eden_election[0]?.election)

    setelectionsList(electionsData.eden_election || [])

    setExpenseByElectionsList(
      newDataExpenseFormatByAllElections(expenseByElections.data || [])
    )
  }, [])

  useEffect(async () => {
    if (showElectionRadio === 'allElections') {
      const totalExpenseByDelegate = await loadTotalExpenseByDelegate()
      const totalByCategory = await loadTotalByCategory()

      setCategoryList(
        newDataFormatTotalByCategoryExpense(
          totalByCategory?.data?.total_by_category || []
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
      electionsList,
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
