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
  try {
    const electionsQuery = {
      eden_delegate: { account: { _eq: delegateAccount } }
    }
    const elections = await edenElectionGql.get(electionsQuery, true)

    for (const { id, election } of elections) {
      const incomeQuery = {
        eden_election: {
          eden_delegate: { account: { _eq: delegateAccount } },
          election: { _eq: election }
        },
        type: { _eq: 'income' }
      }
      const expenseQuery = {
        eden_election: {
          eden_delegate: { account: { _eq: delegateAccount } },
          election: { _eq: election }
        },
        type: { _eq: 'expense' },
        category: { _neq: 'uncategorized' }
      }

      const income = (await edenTransactionGql.getAggregate(incomeQuery)) || 0

      const expense = (await edenTransactionGql.getAggregate(expenseQuery)) || 0

      if (expense + amount <= income) {
        return { election, idElection: id }
      }
    }

    return {
      election: elections[elections.length - 1].election,
      idElection: elections[elections.length - 1].id
    }
  } catch (error) {
    console.error('An error occurred in getElectionWithoutExpense: ', error)
  }
}

module.exports = {
  memoSplit,
  isEdenExpense,
  getElectionWithoutExpense
}
