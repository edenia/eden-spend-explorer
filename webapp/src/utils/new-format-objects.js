import { listChartColors } from '../constants'

let CURRENT_GRAPHIC_COLOR = 0

export const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

export const newDataFormatByDelegatesIncome = transactionsList =>
  transactionsList.map(data => ({
    name: data.recipient,
    EOS_CLAIMED: Number(data.eos_claimed),
    USD_CLAIMED: Number(data.usd_claimed),
    EOS_UNCLAIMED: Number(data.eos_unclaimed),
    USD_UNCLAIMED: Number(data.usd_unclaimed),
    EOS_CLAIMED_PERCENT: Number(
      (data.eos_claimed / (data.eos_claimed + data.eos_unclaimed || 1)) * 100
    ),
    EOS_UNCLAIMED_PERCENT: Number(
      (data.eos_unclaimed / (data.eos_claimed + data.eos_unclaimed || 1)) * 100
    ),
    color: generateColor()
  }))

export const newDataFormatByTreasuryList = (
  treasuryList,
  nextEdenDisbursement,
  estimatedTreasury,
  usdEstimatedTreasury
) => {
  const newTreasuryList = []

  for (let index = 0; index < treasuryList.length - 1; index++) {
    const curDate = treasuryList[index].date.split('T')[0]
    if (
      !newTreasuryList.find(element => element.date.split('T')[0] === curDate)
    )
      newTreasuryList.push({
        EOS_BALANCE: treasuryList[index].balance,
        USD_BALANCE: treasuryList[index].usd_total,
        date: treasuryList[index].date.split('T')[0],
        isValued: false
      })
  }
  const curDate = treasuryList.at(-1)?.date.split('T')[0]
  if (!newTreasuryList.find(element => element.date.split('T')[0] === curDate))
    newTreasuryList.push({
      EOS_BALANCE: treasuryList.at(-1)?.balance,
      USD_BALANCE: treasuryList.at(-1)?.usd_total,
      EOS_VALUED: treasuryList.at(-1)?.balance,
      USD_VALUED: treasuryList.at(-1)?.usd_total,
      date: treasuryList.at(-1)?.date.split('T')[0],
      isValued: false
    })

  const dateFormat = new Date(nextEdenDisbursement)?.toISOString().split('T')[0]
  newTreasuryList.push({
    EOS_VALUED: estimatedTreasury,
    date: dateFormat,
    USD_VALUED: usdEstimatedTreasury,
    isValued: true
  })

  return newTreasuryList
}

export const newDataExpenseFormatByAllElections = ({
  eden_historic_election: electionsList = [],
  total_expense_by_all_election: expensesList = []
}) =>
  expensesList.map(data => ({
    election: `Election ${data.election + 1}`,
    date: electionsList[data.election]?.date_election,
    EOS_CATEGORIZED: Number(data.eos_categorized),
    EOS_UNCATEGORIZED: Number(data.eos_uncategorized),
    USD_CATEGORIZED: Number(data.usd_categorized),
    USD_UNCATEGORIZED: Number(data.usd_uncategorized),
    EOS_TOTAL: Number(data.eos_categorized + data.eos_uncategorized),
    USD_TOTAL: Number(data.usd_categorized + data.usd_uncategorized),
    EOS_CATEGORIZED_PERCENT: data.percent_categorized,
    EOS_UNCATEGORIZED_PERCENT: 100 - data.percent_categorized
  }))

export const newDataIncomeFormatByAllElections = ({
  eden_historic_election: electionsList = [],
  total_income_by_all_elections: incomesList = []
}) =>
  incomesList.map(data => ({
    election: `Election ${data.election + 1}`,
    date: electionsList[data.election]?.date_election,
    EOS_CLAIMED: Number(data.eos_claimed),
    EOS_UNCLAIMED: Number(data.eos_unclaimed),
    USD_CLAIMED: Number(data.usd_claimed),
    USD_UNCLAIMED: Number(data.usd_unclaimed),
    EOS_TOTAL: Number(data.eos_claimed + data.eos_unclaimed),
    USD_TOTAL: Number(data.usd_claimed + data.usd_unclaimed),
    EOS_CLAIMED_PERCENT: data.percent_claimed,
    EOS_UNCLAIMED_PERCENT: data.percent_unclaimed
  }))

export const newDataFormatByAllDelegatesExpense = transactionsList =>
  transactionsList.map(data => ({
    name: data.delegate_payer,
    EOS_CATEGORIZED: Number(data.amount),
    USD_CATEGORIZED: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatByElectionAndDelegateExpense = transactionsList =>
  transactionsList.map(data => ({
    name: data.account,
    EOS_CATEGORIZED: Number(data.eos_expense),
    USD_CATEGORIZED: Number(data.usd_expense),
    EOS_UNCATEGORIZED: Number(data.eos_income - data.eos_expense),
    USD_UNCATEGORIZED: Number(data.usd_income - data.usd_expense),
    EOS_CATEGORIZED_PERCENT:
      data.percent_claimed > 100
        ? 100
        : data.percent_claimed < 0
        ? 0
        : data.percent_claimed,
    EOS_UNCATEGORIZED_PERCENT:
      100 - data.percent_claimed > 100
        ? 100
        : 100 - data.percent_claimed < 0
        ? 0
        : 100 - data.percent_claimed,

    color: generateColor()
  }))

export const newDataFormatTotalByCategoryExpense = totalByCategory =>
  totalByCategory.map(data => ({
    name: data.category,
    EOS_CATEGORIZED: Number(data.amount),
    USD_CATEGORIZED: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatExpenseByCategoryAndElection = totalByCategory =>
  totalByCategory.map(data => ({
    name: data.category,
    EOS_CATEGORIZED: Number(data.total_eos_amount),
    USD_CATEGORIZED: Number(data.total_usd_amount),
    color: generateColor()
  }))

export const generateDelegateData = (
  type,
  category,
  eos,
  usd,
  eosUnclass,
  usdUnclass
) => {
  const delegateData = {
    type: type,
    category: category,
    EOS_: Number(eos),
    USD_: Number(usd),
    EOS_UN: Number(eosUnclass),
    USD_UN: Number(usdUnclass)
  }
  return delegateData
}

export const newDataFormatByTypeDelegate = (incomeList, expenseList) => {
  const transactions = []

  const resultUncategorizedEOS =
    (incomeList[0]?.eos_claimed || 0) +
    (incomeList[0]?.eos_unclaimed || 0) -
    (expenseList[0]?.eos_expense || 0)
  const resultUncategorizedUSD =
    (incomeList[0]?.usd_claimed || 0) +
    (incomeList[0]?.usd_unclaimed || 0) -
    (expenseList[0]?.usd_expense || 0)

  transactions.push(
    generateDelegateData(
      'income',
      'Claimed',
      incomeList[0]?.eos_claimed || 0,
      incomeList[0]?.usd_claimed || 0,
      incomeList[0]?.eos_unclaimed || 0,
      incomeList[0]?.usd_unclaimed || 0
    )
  )

  transactions.push(
    generateDelegateData(
      'expense',
      'Categorized',
      expenseList[0]?.eos_expense || 0,
      expenseList[0]?.usd_expense || 0,
      resultUncategorizedEOS >= 0 ? resultUncategorizedEOS : 0 || 0,
      resultUncategorizedUSD >= 0 ? resultUncategorizedUSD : 0 || 0
    )
  )

  return transactions
}

export const newDataFormatByCategoryDelegate = categoryList =>
  categoryList.map(data => ({
    category: data.category,
    EOS: Number(data.total_eos_amount),
    USD: Number(data.total_usd_amount),
    color: generateColor()
  }))
