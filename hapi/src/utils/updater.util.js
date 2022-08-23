const { transactionConstant } = require('../constants')

const isEdenExpense = memoString => {
  const memoSplit = memoString.split(':')
  return memoSplit[0].toLowerCase() === 'eden_expense'
}

const memoSplit = memoString => {
  const memoSplit = memoString.split('/')
  const category = transactionConstant.CATEGORIES.includes(
    memoSplit[0].toLowerCase()
  )
    ? memoSplit[0]
    : 'uncategorized'
  const description = category !== 'uncategorized' ? memoSplit[1] : memoString

  return { category, description }
}

module.exports = {
  memoSplit,
  isEdenExpense
}
