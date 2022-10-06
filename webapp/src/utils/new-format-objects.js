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
    EOS: Number(data.amount).toFixed(2),
    USD: Number(data.usd_total).toFixed(2),
    color: generateColor()
  }))

export const newDataFormatByAllDelegates = transactionsList =>
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
