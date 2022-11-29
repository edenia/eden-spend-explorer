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
  const elections = []
  let electionNum = 0
  let usdTotal = 0
  let eosTotal = 0
  for (let pos = 0; pos < electionsList.length; pos++) {
    if (electionsList[pos].election === electionNum) {
      if (electionsList[pos].category !== 'uncategorized') {
        usdTotal += electionsList[pos].usd_total
        eosTotal += electionsList[pos].amount
      } else {
        const election = {
          election: `Election ${electionsList[pos].election + 1}`,
          EOS_TOTAL: Number(eosTotal + electionsList[pos].amount),
          USD_TOTAL: Number(usdTotal + electionsList[pos].usd_total),
          EOS_CATEGORIZED: Number(eosTotal),
          USD_CATEGORIZED: Number(usdTotal),
          EOS_UNCATEGORIZED: Number(electionsList[pos].amount),
          USD_UNCATEGORIZED: Number(electionsList[pos].usd_total)
        }
        elections.push(election)
        eosTotal = 0
        usdTotal = 0
        electionNum++
      }
    } else {
      const election = {
        election: `Election ${electionsList[pos].electionNum + 1}`,
        EOS_TOTAL: Number(eosTotal + electionsList[pos].amount),
        USD_TOTAL: Number(usdTotal + electionsList[pos].usd_total),
        EOS_CATEGORIZED: Number(eosTotal),
        USD_CATEGORIZED: Number(usdTotal),
        EOS_UNCATEGORIZED: Number(electionsList[pos].amount),
        USD_UNCATEGORIZED: Number(electionsList[pos].usd_total)
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
    expenseList[0]?.eos_uncategorized - incomeList[0]?.eos_claimed
  const resultUncategorizedUSD =
    expenseList[0]?.usd_uncategorized - incomeList[0]?.usd_claimed
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
