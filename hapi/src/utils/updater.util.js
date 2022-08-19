const isEdenExpense = memoString => {
  let splitMemo = memoString.split(':')
  return splitMemo[0].toLowerCase() === 'eden_expense'
}

const memoSplit = memoString => {
  const categories = [
    'admin',
    'charity',
    'development',
    'dues',
    'education',
    'hardware',
    'infrastructure',
    'legal',
    'marketing',
    'pomelo',
    'salaries',
    'software',
    'travel'
  ]
  const memoSplit = memoString.split('/')
  const category = categories.includes(memoSplit[0].toLowerCase())
    ? memoSplit[0]
    : 'uncategorized'
  const description = category !== 'uncategorized' ? memoSplit[1] : memoString

  return { category, description }
}

module.exports = {
  memoSplit,
  isEdenExpense
}
