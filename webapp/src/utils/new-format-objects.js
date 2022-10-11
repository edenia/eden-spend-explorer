import { listChartColors } from '../constants'

let CURRENT_GRAPHIC_COLOR = 0

const generateColor = () => {
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
    name: data.category,
    EOS: Number(data.amount),
    USD: Number(data.usd_total)
  }))

export const newDataFormatByClasification = (dataList, category) => {
  const uppercaseCategory = category.toUpperCase()

  return dataList.map(data => ({
    name: data?.delegate_payer || data?.recipient,
    [`EOS_${uppercaseCategory}`]: Number(data[`eos_${category}`]),
    [`EOS_UN${uppercaseCategory}`]: Number(data[`eos_un${category}`]),
    [`USD_${uppercaseCategory}`]: Number(data[`usd_${category}`]),
    [`USD_UN${uppercaseCategory}`]: Number(data[`usd_un${category}`]),
    EXCHANGE_RATE: Number(data.exchange_rate)
  }))
}
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