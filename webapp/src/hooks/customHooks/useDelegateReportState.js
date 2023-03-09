import { useEffect, useState } from 'react'

import {
  newDataFormatByTypeDelegate,
  newDataFormatByCategoryDelegate
} from '../../utils/new-format-objects'
import {
  GET_ELECTIONS,
  GET_MAX_DELEGATE_LEVEL,
  GET_HISTORIC_ELECTIONS,
  GET_EXPENSE_BY_CATEGORY,
  GET_TOTAL_EXPENSE_BY_ELECTION,
  GET_TOTAL_DELEGATE_INCOME_BY_ELECTION,
  GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION
} from '../../gql'
import { useImperativeQuery, getDelegatesProfileInformation } from '../../utils'

const useDelegateReportState = () => {
  const [electionRoundSelect, setElectionRoundSelect] = useState()
  const [electionRoundList, setElectionRoundList] = useState([])
  const [transactionList, setTransactionList] = useState([])
  const [delegateSelect, setDelegateSelect] = useState('')
  const [accordionList, setAccordionList] = useState([])
  const [delegateList, setDelegateList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [profilesList, setProfilesList] = useState([])
  const [dateElection, setDateElection] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [loader, setLoader] = useState(false)

  const loadHistoricElection = useImperativeQuery(GET_HISTORIC_ELECTIONS)
  const loadCategoryList = useImperativeQuery(GET_EXPENSE_BY_CATEGORY)
  const loadElections = useImperativeQuery(GET_ELECTIONS)
  const loadMaxDelegateLevel = useImperativeQuery(GET_MAX_DELEGATE_LEVEL)
  const loadTransactions = useImperativeQuery(
    GET_TRANSACTIONS_BY_DELEGATE_AND_ELECTION
  )
  const loadDelegatesByElection = useImperativeQuery(
    GET_TOTAL_DELEGATE_INCOME_BY_ELECTION
  )
  const getTotalExpenseByDelegate = useImperativeQuery(
    GET_TOTAL_EXPENSE_BY_ELECTION
  )

  useEffect(async () => {
    const { data: electionsData } = await loadElections()

    const currentElection = electionsData.eden_election.at(-1).election

    setElectionRoundSelect(currentElection)

    setElectionRoundList(electionsData.eden_election)
  }, [])

  useEffect(async () => {
    if (electionRoundSelect === undefined) return

    setLoader(true)

    const { data: maxDelegateLevelData } = await loadMaxDelegateLevel({
      election: electionRoundSelect
    })

    const { data: delegatesData } = await loadDelegatesByElection({
      where: { election: { _eq: electionRoundSelect } }
    })

    const { data: historicElectionData } = await loadHistoricElection({
      where: { election: { _eq: electionRoundSelect } }
    })

    const delegates = delegatesData.historic_incomes || []
    const maxLevel = maxDelegateLevelData.eden_election[0]?.delegate_level || 0

    setProfilesList(
      (await getDelegatesProfileInformation(delegates, maxLevel)) || []
    )

    setLoader(false)

    setDelegateList(delegates)

    setDateElection(
      historicElectionData.eden_historic_election[0].date_election
    )
  }, [electionRoundSelect])

  useEffect(async () => {
    if (!delegateSelect) return

    const { data: electionId } = await loadElections({
      where: {
        eden_delegate: { account: { _eq: delegateSelect } },
        election: { _eq: electionRoundSelect }
      }
    })

    const { data: responseCategory } = await loadCategoryList({
      id_election: electionId?.eden_election[0].id
    })

    const responseTransaction = await loadTransactions({
      election: Number(electionRoundSelect),
      delegate: delegateSelect
    })

    const { data: responseTotalExpenseByElection } =
      await getTotalExpenseByDelegate({
        election: electionRoundSelect,
        account: delegateSelect
      })

    const transactions = newDataFormatByTypeDelegate(
      responseTransaction.data.historic_incomes || [],
      responseTotalExpenseByElection.global_amount || []
    )

    const categories = newDataFormatByCategoryDelegate(
      responseCategory?.expenses_by_category_election_and_delegate || []
    )

    setCategoryList(categories)
    setTransactionList(transactions)
  }, [delegateSelect])

  useEffect(() => {
    setAccordionList(
      profilesList.filter(delegate => delegate?.account?.includes(searchValue))
    )
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
      accordionList,
      searchValue
    },
    {
      setElectionRoundSelect,
      setDelegateSelect,
      setSearchValue
    }
  ]
}

export default useDelegateReportState
