import { listChartColors } from '../constants'

let CURRENT_GRAPHIC_COLOR = 0

export const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

export const newDataFormatPercentAllElections = (
  percentAllElectionData,
  category
) => {
  const uppercaseCategory = category.toUpperCase()

  return percentAllElectionData.map(data => ({
    name: `Election ${data.election + 1}`,
    [`EOS_${uppercaseCategory}_PERCENT`]: Number(data[`eos_${category}`]) * 100,
    [`EOS_UN${uppercaseCategory}_PERCENT`]:
      Number(data[`eos_un${category}`]) * 100
  }))
}

export const newDataFormatByDelegatesIncome = transactionsList =>
  transactionsList.map(data => ({
    name: data.recipient,
    EOS_CLAIMED: Number(data.eos_claimed),
    USD_CLAIMED: Number(data.usd_claimed),
    EOS_UNCLAIMED: Number(data.eos_unclaimed),
    USD_UNCLAIMED: Number(data.usd_unclaimed),
    EOS_CLAIMED_PERCENT: Number(
      (data.eos_claimed / (data.eos_claimed + data.eos_unclaimed)) * 100
    ),
    EOS_UNCLAIMED_PERCENT: Number(
      (data.eos_unclaimed / (data.eos_claimed + data.eos_unclaimed)) * 100
    ),
    color: generateColor()
  }))

const createElection = (
  newElection,
  newDate,
  eosCategorized,
  eosUncategorized,
  usdCategorized,
  usdUncategorized
) => {
  const election = {
    election: `Election ${newElection + 1}`,
    date: newDate,
    EOS_CATEGORIZED: Number(eosCategorized),
    EOS_UNCATEGORIZED: Number(eosUncategorized),
    USD_CATEGORIZED: Number(usdCategorized),
    USD_UNCATEGORIZED: Number(usdUncategorized),
    EOS_TOTAL: Number(eosCategorized + eosUncategorized),
    USD_TOTAL: Number(usdCategorized + usdUncategorized)
  }
  return election
}

export const newDataFormatByCategorizedElectionsExpense = electionsList => {
  const dataElections = electionsList.total_by_category_and_election
  const historicElections = electionsList.eden_historic_election
  const electionsByNumber = dataElections.reduce(
    (acc, { election, category, amount, usd_total: usdTotal }) => {
      if (!acc[election]) {
        acc[election] = {
          election,
          date: historicElections.find(({ election: e }) => e === election)
            .date_election,
          eosCategorized: 0,
          eosUncategorized: 0,
          usdCategorized: 0,
          usdUncategorized: 0
        }
      }
      acc[election][
        category !== 'Uncategorized' ? 'eosCategorized' : 'eosUncategorized'
      ] += amount
      acc[election][
        category !== 'Uncategorized' ? 'usdCategorized' : 'usdUncategorized'
      ] += usdTotal
      return acc
    },
    {}
  )

  return Object.values(electionsByNumber).map(
    ({
      election,
      date,
      eosCategorized,
      eosUncategorized,
      usdCategorized,
      usdUncategorized
    }) =>
      createElection(
        election,
        date,
        eosCategorized,
        eosUncategorized,
        usdCategorized,
        usdUncategorized
      )
  )
}

export const newDataFormatByAllDelegatesExpense = transactionsList =>
  transactionsList.map(data => ({
    name: data.delegate_payer,
    EOS_CATEGORIZED: Number(data.amount),
    USD_CATEGORIZED: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatByElectionAndDelegateExpense = transactionsList =>
  transactionsList.map(data => ({
    name: data.delegate_payer,
    EOS_CATEGORIZED: Number(data.eos_categorized),
    USD_CATEGORIZED: Number(data.usd_categorized),
    EOS_UNCATEGORIZED: Number(
      data.eos_claimed + data.eos_unclaimed - data.eos_categorized
    ),
    USD_UNCATEGORIZED: Number(data.usd_uncategorized),
    EOS_CATEGORIZED_PERCENT: Number(
      (data.eos_categorized / (data.eos_claimed + data.eos_unclaimed)) * 100
    ),
    EOS_UNCATEGORIZED_PERCENT: Number(
      ((data.eos_claimed + data.eos_unclaimed - data.eos_categorized) /
        (data.eos_claimed + data.eos_unclaimed)) *
        100
    ),
    color: generateColor()
  }))

export const newDataFormatTotalByCategoryExpense = totalByCategory =>
  totalByCategory.map(data => ({
    name: data.category ? data.category : `Election ${data.election + 1}`,
    EOS_CATEGORIZED: Number(data.amount),
    USD_CATEGORIZED: Number(data.usd_total),
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
    (expenseList[0]?.eos_categorized || 0)
  const resultUncategorizedUSD =
    (incomeList[0]?.usd_claimed || 0) +
    (incomeList[0]?.usd_unclaimed || 0) -
    (expenseList[0]?.usd_categorized || 0)

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
      expenseList[0]?.eos_categorized || 0,
      expenseList[0]?.usd_categorized || 0,
      resultUncategorizedEOS || 0,
      resultUncategorizedUSD || 0
    )
  )

  return transactions
}

export const newDataFormatByCategoryDelegate = (categoryList, transaction) => {
  const newCategoryList = []

  categoryList.forEach(data => {
    if (data.category === 'uncategorized') return

    newCategoryList.push({
      category: data.category,
      EOS: Number(data.amount),
      USD: Number(data.usd_total),
      color: generateColor()
    })
  })

  newCategoryList.push({
    category: 'uncategorized',
    EOS: transaction[1].EOS_UN,
    USD: transaction[1].USD_UN,
    color: generateColor()
  })

  return newCategoryList
}
