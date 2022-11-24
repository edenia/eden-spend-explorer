import { useEffect, useReducer } from 'react'
import { gql, GraphQLClient } from 'graphql-request'

import {
  GET_ELECTIONS_BY_YEAR,
  GET_MEMBERS_DATA,
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION,
  GET_EXPENSE_BY_CATEGORY,
  GET_INITIAL_DELEGATE_DATA
} from '../../gql'
import {
  newDataFormatByTypeDelegate,
  newDataFormatByCategoryDelegate
} from '../../utils/new-format-objects'
import { useImperativeQuery, classifyMemberRank } from '../../utils'

const INIT_REDUCER_DATA = {
  electionRoundSelect: null,
  delegateSelect: '',
  electionRoundList: [],
  delegateList: [],
  transactionList: [],
  categoryList: [],
  accordionList: [],
  profilesList: [],
  loader: false,
  maxLevel: 0,
  searchValue: ''
}
const client = new GraphQLClient('https://eden-api.edenia.cloud/v1/graphql', {
  headers: {}
})

const delegateReportStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GENERAL_DATA':
      return { ...state, ...action.payload }

    case 'SET_DELEGATE_SELECT':
      return { ...state, delegateSelect: action.payload }

    case 'SET_ROUND_SELECT':
      return { ...state, electionRoundSelect: action.payload }

    case 'SET_SEARCH_VALUE':
      return { ...state, searchValue: action.payload }

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
    electionRoundList,
    delegateList,
    transactionList,
    categoryList,
    maxLevel,
    dateElection,
    loader,
    accordionList,
    searchValue,
    profilesList
  } = state

  const setDelegateSelect = delegateSelect => {
    dispatch({ type: 'SET_DELEGATE_SELECT', payload: delegateSelect })
  }

  const setElectionRoundSelect = electionRoundSelect => {
    dispatch({ type: 'SET_ROUND_SELECT', payload: electionRoundSelect })
  }

  const setSearchValue = searchValue => {
    dispatch({ type: 'SET_SEARCH_VALUE', payload: searchValue })
  }

  const loadTransactions = useImperativeQuery(
    GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION
  )
  const loadInitialData = useImperativeQuery(GET_INITIAL_DELEGATE_DATA)
  const loadCategoryList = useImperativeQuery(GET_EXPENSE_BY_CATEGORY)
  const loadElectionsByYear = useImperativeQuery(GET_ELECTIONS_BY_YEAR)

  useEffect(async () => {
    const responseElectionByYear = await loadElectionsByYear({
      minDate: `2021-01-01`,
      maxDate: `${new Date().getFullYear()}-12-31`
    })
    const currentElection =
      responseElectionByYear.data?.eden_historic_election.at(-1).election
    const responseInitialData = await loadInitialData({
      election: currentElection
    })
    const maxLevel =
      responseInitialData.data?.delegateFrontend?.data.at(-1).delegate_level

    dispatch({
      type: 'SET_GENERAL_DATA',
      payload: {
        electionRoundList: responseElectionByYear.data?.eden_historic_election,
        electionRoundSelect: currentElection,
        maxLevel
      }
    })
  }, [])

  useEffect(async () => {
    if (electionRoundSelect == null) return

    const responseInitialData = await loadInitialData({
      election: electionRoundSelect
    })
    const length = responseInitialData.data?.delegateFrontend?.data.length
    const maxLevel =
      responseInitialData.data?.delegateFrontend?.data.at(-1).delegate_level
    const selectedElectionDate =
      responseInitialData.data?.delegateFrontend?.data.at(-2)
    const delegates =
      responseInitialData.data.delegateFrontend?.data.slice(0, length - 2) || []

    if (delegates.length > 0) {
      getProfiles(delegates)
    }

    dispatch({
      type: 'SET_GENERAL_DATA',
      payload: {
        maxLevel,
        dateElection: selectedElectionDate.date_election,
        delegateList: delegates
      }
    })
  }, [electionRoundSelect])

  useEffect(async () => {
    if (!delegateSelect) return

    const responseCategory = await loadCategoryList({
      election: Number(electionRoundSelect),
      delegate: delegateSelect
    })

    const responseTransaction = await loadTransactions({
      election: Number(electionRoundSelect),
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
        transactionList: transactions || [],
        categoryList: categories || []
      }
    })
  }, [delegateSelect])

  const getProfiles = async delegates => {
    if (delegates[0].delegate_payer) {
      dispatch({ type: 'SET_GENERAL_DATA', payload: { loader: true } })
      const variables = {
        value: delegates.reduce((reduceList, delegate) => {
          return [...reduceList, delegate.delegate_payer]
        }, []),
        orderBy: {
          election_rank: 'desc'
        },
        limit: 50
      }
      const response = await client.request(
        gql`
          ${GET_MEMBERS_DATA}
        `,
        variables
      )

      dispatch({
        type: 'SET_GENERAL_DATA',
        payload: {
          loader: false,
          profilesList: response.members.map(member => {
            const posDelegate = delegates.find(
              delegate => delegate.delegate_payer === member.account
            )

            if (posDelegate) {
              const rank = classifyMemberRank(
                posDelegate.delegate_level,
                maxLevel
              )

              return { ...member, rank, totalRewarded: posDelegate.totalIncome }
            }

            return member
          })
        }
      })
    }
  }

  useEffect(() => {
    dispatch({
      type: 'SET_GENERAL_DATA',
      payload: {
        accordionList: profilesList.filter(delegate =>
          delegate?.account?.includes(searchValue)
        )
      }
    })
  }, [profilesList, searchValue])

  accordionList.sort((d1, d2) => {
    if (d1?.totalRewarded < d2?.totalRewarded) return 1
    else if (d1?.totalRewarded > d2?.totalRewarded) return -1
    else return 0
  })

  accordionList.sort((d1, d2) => {
    if (d1?.rank?.memberType < d2?.rank?.memberType) return 1
    else if (d1?.rank?.memberType > d2?.rank?.memberType) return -1
    else return 0
  })

  return [
    {
      electionRoundSelect,
      electionRoundList,
      delegateList,
      dateElection,
      transactionList,
      categoryList,
      loader,
      accordionList
    },
    {
      setElectionRoundSelect,
      setDelegateSelect,
      setSearchValue
    }
  ]
}

export default useDelegateReportState
