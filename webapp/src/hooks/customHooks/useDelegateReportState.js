import { useCallback, useEffect, useReducer } from 'react'
// import { useLazyQuery } from '@apollo/client'

import { GET_ELECTIONS_BY_YEAR } from '../../gql/general.gql'
import {
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
  GET_EXPENSE_BY_CATEGORY,
  GET_INITIAL_DELEGATE_DATA
} from '../../gql/delegate.gql'
import {
  newDataFormatByTypeDelegate,
  newDataFormatByCategoryDelegate
} from '../../utils/new-format-objects'
import { useImperativeQuery } from '../../utils'

const INIT_REDUCER_DATA = {
  electionRoundSelect: 0,
  delegateSelect: '',
  electionsByYearList: [],
  delegateList: [],
  transactionList: [],
  categoryList: [],
  maxLevel: 0,
  dateElection: '2021-10-09T00:00:00+00:00'
}

const delegateReportStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GENERAL_DATA':
      return { ...state, ...action.payload }

    case 'SET_DELEGATE_LIST':
      return { ...state, delegateList: action.payload }

    case 'SET_DELEGATE_SELECT':
      return { ...state, delegateSelect: action.payload }

    case 'SET_ROUND_SELECT':
      return { ...state, electionRoundSelect: action.payload }

    default:
      break
  }
}

const useDelegateReportState = () => {
  const [state, dispatch] = useReducer(
    delegateReportStateReducer,
    INIT_REDUCER_DATA
  )

  const {
    electionRoundSelect,
    delegateSelect,
    electionsByYearList,
    delegateList,
    transactionList,
    categoryList,
    maxLevel,
    dateElection
  } = state

  const getDataByDelegate = useCallback(async () => {
    const responseInitialData = await loadInitialData({
      election: electionRoundSelect
    })

    const length = responseInitialData.data?.delegateFrontend?.data.length

    const maxLevel =
      responseInitialData.data?.delegateFrontend?.data[length - 1]
        .delegate_level || 0
    const dateElection =
      responseInitialData.data?.delegateFrontend?.data[length - 2]
        .date_election || '2021-10-09T00:00:00+00:00'
    const delegates =
      responseInitialData.data.delegateFrontend?.data.slice(0, length - 3) || []

    const responseCategory = await loadCategoryList({
      election: electionRoundSelect,
      delegate: delegateSelect
    })

    const responseTransaction = await loadTransactions({
      election: electionRoundSelect,
      delegate: delegateSelect
    })

    const categories = newDataFormatByCategoryDelegate(
      responseCategory.data?.expenses_by_category_and_delegate || []
    )

    const transactions = newDataFormatByTypeDelegate(
      responseTransaction.data.historic_incomes || [],
      responseTransaction.data.historic_expenses || []
    )

    dispatch({
      type: 'SET_GENERAL_DATA',
      payload: {
        maxLevel: maxLevel,
        dateElection: dateElection,
        delegateList: delegates,
        transactionList: transactions || [],
        categoryList: categories || [],
        electionRoundSelect
      }
    })
  }, [electionRoundSelect, delegateSelect])

  const setDelegatesList = useCallback(
    delegateList => {
      dispatch({ type: 'SET_DELEGATE_LIST', payload: delegateList })
    },
    [electionRoundSelect]
  )

  const setDelegateSelect = delegateSelect => {
    dispatch({ type: 'SET_DELEGATE_SELECT', payload: delegateSelect })
  }

  const setElectionRoundSelect = electionRoundSelect => {
    dispatch({ type: 'SET_ROUND_SELECT', payload: electionRoundSelect })
  }

  // const [electionRoundSelect, setElectionRoundSelect] = useState(0)
  // const [delegateSelect, setDelegateSelect] = useState('')
  // const [electionsByYearList, setElectionsByYearList] = useState([])
  // const [delegateList, setDelegatesList] = useState([])
  // const [transactionList, setTransactionList] = useState([])
  // const [categoryList, setCategoryList] = useState([])
  // const [maxLevel, setMaxLevel] = useState(0)
  // const [dateElection, setDateElection] = useState('2021-10-09T00:00:00+00:00')

  // const [transactionsData, setTransactionData] = useState([])
  // const [categoryListData, setCategoryListData] = useState([])
  // const [initialData, setInitialData] = useState([])

  const loadTransactions = useImperativeQuery(
    GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION
  )

  // const [loadInitialData, { data: initialData }] = useLazyQuery(
  //   GET_INITIAL_DELEGATE_DATA
  // )

  // const [loadCategoryList, { data: categoryListData }] = useLazyQuery(
  //   GET_EXPENSE_BY_CATEGORY
  // )

  // const [loadElectionsByYear, { data: electionsByYearData }] = useLazyQuery(
  //   GET_ELECTIONS_BY_YEAR,
  //   {
  //     variables: {
  //       minDate: `2021-01-01`,
  //       maxDate: `${new Date().getFullYear()}-12-31`
  //     }
  //   }
  // )

  const loadInitialData = useImperativeQuery(GET_INITIAL_DELEGATE_DATA)

  const loadCategoryList = useImperativeQuery(GET_EXPENSE_BY_CATEGORY)

  const loadElectionsByYear = useImperativeQuery(GET_ELECTIONS_BY_YEAR)

  useEffect(() => {
    const test = async () => {
      const responseElectionByYear = await loadElectionsByYear({
        minDate: `2021-01-01`,
        maxDate: `${new Date().getFullYear()}-12-31`
      })

      const responseInitialData = await loadInitialData({
        election: electionRoundSelect
      })

      const length = responseInitialData.data?.delegateFrontend?.data.length

      const maxLevel =
        responseInitialData.data?.delegateFrontend?.data[length - 1]
          .delegate_level || 0
      const dateElection =
        responseInitialData.data?.delegateFrontend?.data[length - 2]
          .date_election || '2021-10-09T00:00:00+00:00'
      const delegates =
        responseInitialData.data.delegateFrontend?.data.slice(0, length - 3) ||
        []

      // console.log({
      //   responseTransaction: responseTransaction.data,
      //   responseCategory: responseCategory.data,
      //   responseInitialData: responseInitialData.data,
      //   setInitialData,
      //   dispatch
      // })

      dispatch({
        type: 'SET_GENERAL_DATA',
        payload: {
          maxLevel: maxLevel,
          dateElection: dateElection,
          delegateList: delegates,
          electionsByYearList:
            responseElectionByYear.data?.eden_historic_election
        }
      })
    }

    console.count()
    test()
  }, [])

  useEffect(() => {
    getDataByDelegate()
  }, [delegateSelect, electionRoundSelect, getDataByDelegate])

  // console.log({
  //   electionRoundSelect,
  //   delegateSelect,
  //   electionsByYearList,
  //   delegateList,
  //   transactionList,
  //   categoryList,
  //   maxLevel,
  //   dateElection
  // })

  // useEffect(() => {
  //   // loadInitialData({
  //   //   variables: {
  //   //     election: 0
  //   //   }
  //   // })
  //   loadElectionsByYear()
  // }, [])

  // useEffect(() => {
  //   if (!initialData) return

  //   const length = initialData?.delegateFrontend?.data.length

  //   const maxLevel =
  //     initialData?.delegateFrontend?.data[length - 1].delegate_level || 0
  //   const dateElection =
  //     initialData?.delegateFrontend?.data[length - 2].date_election ||
  //     '2021-10-09T00:00:00+00:00'
  //   const delegates =
  //     initialData.delegateFrontend?.data.slice(0, length - 3) || []
  //   console.log(maxLevel, dateElection, delegates)
  //   // setMaxLevel(maxLevel)
  //   // setDateElection(dateElection)
  //   // setDelegatesList(delegates)
  // }, [initialData])

  // election
  // useEffect(() => {
  //   if (!electionsByYearData?.eden_historic_election[0]) return
  //   setElectionsByYearList(electionsByYearData?.eden_historic_election || [])
  // }, [electionsByYearData])

  // useEffect(() => {
  //   setTransactionList(
  //     newDataFormatByTypeDelegate(
  //       transactionsData?.historic_incomes || [],
  //       transactionsData?.historic_expenses || []
  //     ) || []
  //   )
  // }, [transactionsData])

  // useEffect(() => {
  //   setCategoryList(
  //     newDataFormatByCategoryDelegate(
  //       categoryListData?.expenses_by_category_and_delegate || []
  //     )
  //   )
  // }, [categoryListData])

  return [
    {
      electionRoundSelect,
      delegateSelect,
      electionsByYearList,
      transactionList,
      delegateList,
      categoryList,
      maxLevel,
      dateElection
    },
    {
      setElectionRoundSelect,
      setDelegateSelect,
      setDelegatesList
    }
  ]
}

export default useDelegateReportState
