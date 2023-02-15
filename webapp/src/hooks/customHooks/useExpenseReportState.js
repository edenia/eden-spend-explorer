import { useEffect, useState } from 'react'

import {
  GET_ELECTIONS,
  GET_TOTAL_EXPENSE_BY_DELEGATE,
  GET_DELEGATES_EXPENSE_BY_ELECTION,
  GET_TOTAL_EXPENSE_BY_CATEGORY_AND_ELECTION,
  GET_TOTAL_EXPENSE_BY_CATEGORY,
  GET_TOTAL_EXPENSE_BY_ALL_ELECTIONS
} from '../../gql'
import {
  newDataExpenseFormatByAllElections,
  newDataFormatByAllDelegatesExpense,
  newDataFormatByElectionAndDelegateExpense,
  newDataFormatExpenseByCategoryAndElection,
  newDataFormatTotalByCategoryExpense
} from '../../utils/new-format-objects'
import { useImperativeQuery } from '../../utils'

const useExpenseReportState = () => {
  const [showElectionRadio, setShowElectionRadio] = useState('allElections')
  const [expenseByElectionsList, setExpenseByElectionsList] = useState([])
  const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  const [electionsList, setelectionsList] = useState([])
  const [delegatesList, setDelegatesList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  const loadElections = useImperativeQuery(GET_ELECTIONS)
  const loadTotalByCategory = useImperativeQuery(GET_TOTAL_EXPENSE_BY_CATEGORY)
  const loadExpenseByElections = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_ALL_ELECTIONS
  )
  const loadTotalExpenseByDelegate = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_DELEGATE
  )
  const loadDelegatesExpenseByElections = useImperativeQuery(
    GET_DELEGATES_EXPENSE_BY_ELECTION
  )
  const loadTotalByCategoryAndElection = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_CATEGORY_AND_ELECTION
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

      const { data: delegatesExpenseByElections } =
        await loadDelegatesExpenseByElections({
          election: electionRoundSelect
        })

      const { data: totalByCategoryAndElection } =
        await loadTotalByCategoryAndElection({
          election: electionRoundSelect
        })

      setDelegatesList(
        newDataFormatByElectionAndDelegateExpense(
          delegatesExpenseByElections?.global_amount || []
        )
      )

      setCategoryList(
        newDataFormatExpenseByCategoryAndElection(
          totalByCategoryAndElection?.expenses_by_category_and_election || []
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
