import { listChartColors } from '../constants'

let CURRENT_GRAPHIC_COLOR = 0

export const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

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

export const newDataFormatPercentByElection = (
  percentByElectionData,
  category
) => {
  const uppercaseCategory = category.toUpperCase()

  return percentByElectionData.map(data => ({
    name: data?.delegate_payer || data?.recipient,
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
    color: generateColor()
  }))

export const newDataFormatByCategorizedElectionsExpense = electionsList => {
  const dataElections = electionsList?.total_by_category_and_election || []
  const historicElections = electionsList?.eden_historic_election || []
  const elections = []
  let electionNum = 0
  let usdTotal = 0
  let eosTotal = 0
  for (let pos = 0; pos < dataElections.length; pos++) {
    if (dataElections[pos].election === electionNum) {
      if (dataElections[pos].category !== 'uncategorized') {
        usdTotal += dataElections[pos].usd_total
        eosTotal += dataElections[pos].amount
      } else {
        const date = historicElections.find(
          element => element.election === dataElections[pos].election
        )
        const election = {
          election: `Election ${dataElections[pos].election + 1}`,
          date: date.date_election,
          EOS_TOTAL: Number(eosTotal + dataElections[pos].amount),
          USD_TOTAL: Number(usdTotal + dataElections[pos].usd_total),
          EOS_CATEGORIZED: Number(eosTotal),
          USD_CATEGORIZED: Number(usdTotal),
          EOS_UNCATEGORIZED: Number(dataElections[pos].amount),
          USD_UNCATEGORIZED: Number(dataElections[pos].usd_total)
        }
        elections.push(election)
        eosTotal = 0
        usdTotal = 0
        electionNum++
      }
    } else {
      const date = historicElections.find(
        element => element.election === dataElections[pos].election
      )
      const election = {
        election: `Election ${dataElections[pos].electionNum + 1}`,
        date: date.date_election,
        EOS_TOTAL: Number(eosTotal + dataElections[pos].amount),
        USD_TOTAL: Number(usdTotal + dataElections[pos].usd_total),
        EOS_CATEGORIZED: Number(eosTotal),
        USD_CATEGORIZED: Number(usdTotal),
        EOS_UNCATEGORIZED: Number(dataElections[pos].amount),
        USD_UNCATEGORIZED: Number(dataElections[pos].usd_total)
      }
      elections.push(election)
      eosTotal = 0
      usdTotal = 0
      electionNum++
      pos--
    }
  }
  return elections
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
    EOS_UNCATEGORIZED: Number(data.eos_uncategorized),
    USD_UNCATEGORIZED: Number(data.usd_uncategorized),
    color: generateColor()
  }))

export const newDataFormatTotalByCategoryExpense = totalByCategory =>
  totalByCategory.map(data => ({
    name: data.category ? data.category : `Election ${data.election + 1}`,
    EOS_CATEGORIZED: Number(data.amount),
    USD_CATEGORIZED: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatByTypeDelegate = (incomeList, expenseList) => {
  const transactions = []
  const resultUncategorizedEOS =
    incomeList[0]?.eos_claimed - expenseList[0]?.eos_categorized
  const resultUncategorizedUSD =
    incomeList[0]?.usd_claimed - expenseList[0]?.usd_categorized
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
      resultUncategorizedEOS > 0 ? resultUncategorizedEOS : 0,
      resultUncategorizedUSD > 0 ? resultUncategorizedUSD : 0
    )
  )
  return transactions
}

export const newDataFormatByCategoryDelegate = categoryList =>
  categoryList.map(data => ({
    category: data.category,
    EOS: Number(data.amount),
    USD: Number(data.usd_total),
    color: generateColor()
  }))
