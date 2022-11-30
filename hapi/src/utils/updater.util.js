const { transactionConstant } = require('../constants')

const isEdenExpense = memoString => {
  const memoSplit = memoString.split(':')
  return memoSplit[0].toLowerCase() === 'eden_expense'
}

const memoSplit = memoString => {
  const memoSplit = memoString.split('/')
  const category = transactionConstant.CATEGORIES.includes(
    memoSplit[0].toLowerCase().trim()
  )
    ? memoSplit[0]
    : 'uncategorized'
  const description = category !== 'uncategorized' ? memoSplit[1] : memoString

  return { category, description }
}

const getElectionWithoutExpense = async (
  delegateAccount,
  amount,
  edenElectionGql,
  edenTransactionGql
) => {
  const elections = await edenElectionGql.get(
    {
      eden_delegate: { account: { _eq: delegateAccount } }
    },
    true
  )

  for (let index = 0; index < elections.length; index++) {
    const { id, election } = elections[index]
    const income = await edenTransactionGql.getAggregate({
      eden_election: {
        eden_delegate: { account: { _eq: delegateAccount } },
        election: { _eq: election }
      },
      type: { _eq: 'income' }
    })
    const expense = await edenTransactionGql.getAggregate({
      eden_election: {
        eden_delegate: { account: { _eq: delegateAccount } },
        election: { _eq: election }
      },
      type: { _eq: 'expense' },
      category: { _eq: 'claimed' }
    })

    if (expense + amount <= income) return { election, idElection: id }
  }

  return {
    election: elections.at(-1).election,
    idElection: elections.at(-1).id
  }
}

module.exports = {
  memoSplit,
  isEdenExpense,
  getElectionWithoutExpense
}
