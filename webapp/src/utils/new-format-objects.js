import { listChartColors } from '../constants'

let CURRENT_GRAPHIC_COLOR = 0

export const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

export const newDataFormatByElection = electionsList =>
  electionsList.map(data => ({
    name: `Election ${data.election + 1}`,
    EOS: Number(data.amount),
    USD: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatByAllDelegatesIncome = transactionsList =>
  transactionsList.map(data => ({
    name: data.eden_delegate.account,
    EOS: Number(data.eden_transactions_aggregate.aggregate.sum.amount),
    USD: Number(data.eden_transactions_aggregate.aggregate.sum.usd_total),
    EXCHANGE_RATE: Number(
      data.eden_transactions_aggregate.aggregate.avg.eos_exchange
    ),
    color: generateColor(),
    level: data.delegate_level,
    link: false
  }))

export const newDataFormatByDelegateAcrossElections = (
  transactionsList,
  isClaimed
) =>
  isClaimed
    ? transactionsList.map(data => ({
        name: data.recipient,
        EOS: Number(data.eos_claimed),
        USD: Number(data.usd_claimed),
        color: generateColor()
      }))
    : transactionsList.map(data => ({
        name: data.recipient,
        EOS: Number(data.eos_claimed + data.eos_unclaimed),
        USD: Number(data.usd_claimed + data.usd_unclaimed),
        color: generateColor()
      }))

export const newDataFormatByAllDelegates = transactionsList =>
  transactionsList.map(data => ({
    name: data.delegate_payer,
    EOS: Number(data.amount),
    USD: Number(data.usd_total),
    EXCHANGE_RATE: Number(data.exchange_rate),
    color: generateColor(),
    level: data.delegate_level,
    link: false
  }))

export const newDataFormatByDelegate = (transactionsList, delegateSelect) =>
  transactionsList.map(data => ({
    name: delegateSelect,
    EOS: Number(data.amount),
    USD: Number(data.usd_total),
    EXCHANGE_RATE: Number(data.eos_exchange),
    date: new Date(data.date).toLocaleDateString(),
    color: generateColor(),
    level: data.eden_election.delegate_level,
    txId: data.txid,
    category: data.category
  }))

export const newDataFormatTotalByCategory = totalByCategory =>
  totalByCategory.map(data => ({
    name: data.category ? data.category : `Election ${data.election + 1}`,
    EOS: Number(data.amount),
    USD: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatPercentAllElections = (
  percentAllElectionData,
  category
) => {
  const uppercaseCategory = category.toUpperCase()

  return percentAllElectionData.map(data => ({
    name: `Election ${data.election + 1}`,
    [`EOS_${uppercaseCategory}`]: Number(data[`eos_${category}`]) * 100,
    [`EOS_UN${uppercaseCategory}`]: Number(data[`eos_un${category}`]) * 100,
    [`USD_${uppercaseCategory}`]: Number(data[`usd_${category}`]) * 100,
    [`USD_UN${uppercaseCategory}`]: Number(data[`usd_un${category}`]) * 100
  }))
}

export const newDataFormatPercentByElection = (
  percentByElectionData,
  category
) => {
  const uppercaseCategory = category.toUpperCase()

  return percentByElectionData.map(data => ({
    name: data?.delegate_payer || data?.recipient,
    [`EOS_${uppercaseCategory}`]: Number(data[`eos_${category}`]) * 100,
    [`EOS_UN${uppercaseCategory}`]: Number(data[`eos_un${category}`]) * 100,
    [`USD_${uppercaseCategory}`]: Number(data[`usd_${category}`]) * 100,
    [`USD_UN${uppercaseCategory}`]: Number(data[`usd_un${category}`]) * 100
  }))
}

export const newDataFormatExpensesAcrossElections = transactionsList =>
  transactionsList.map(data => ({
    name: data.delegate_payer,
    EOS: Number(data.amount),
    USD: Number(data.usd_total),
    color: generateColor()
  }))

export const newDataFormatByElectionAndDelegate = (
  transactionsList,
  isIncome
) =>
  isIncome
    ? transactionsList.map(data => ({
        name: data.recipient,
        EOS_CLAIMED: Number(data.eos_claimed),
        USD_CLAIMED: Number(data.usd_claimed),
        EOS_UNCLAIMED: Number(data.eos_unclaimed),
        USD_UNCLAIMED: Number(data.usd_unclaimed)
      }))
    : transactionsList.map(data => ({
        name: data.delegate_payer,
        EOS_CATEGORIZED: Number(data.eos_categorized),
        USD_CATEGORIZED: Number(data.usd_categorized),
        EOS_UNCATEGORIZED: Number(data.eos_uncategorized),
        USD_UNCATEGORIZED: Number(data.usd_uncategorized)
      }))
