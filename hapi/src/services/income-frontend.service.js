const { incomeFrontend } = require('../gql')
const { listChartColors } = require('../constants')

let CURRENT_GRAPHIC_COLOR = 0

const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors.LISTCHARTCOLORS[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

const createElection = (
  newElection,
  newDate,
  eosClaimed,
  eosUnclaimed,
  usdClaimed,
  usdUnclaimed
) => {
  const election = {
    election: `Election ${newElection + 1}`,
    date: newDate,
    EOS_CLAIMED: Number(eosClaimed),
    EOS_UNCLAIMED: Number(eosUnclaimed),
    USD_CLAIMED: Number(usdClaimed),
    USD_UNCLAIMED: Number(usdUnclaimed),
    EOS_TOTAL: Number(eosClaimed + eosUnclaimed),
    USD_TOTAL: Number(usdClaimed + usdUnclaimed),
    EOS_CLAIMED_PERCENT: Number(eosClaimed / (eosClaimed + eosUnclaimed)) * 100,
    EOS_UNCLAIMED_PERCENT:
      Number(eosUnclaimed / (eosClaimed + eosUnclaimed)) * 100
  }
  return election
}

const newDataFormatByElectionsIncome = electionsList => {
  const dataElections = electionsList.total_by_category_and_election
  const historicElections = electionsList.eden_historic_election

  const electionsByNumber = dataElections.reduce(
    (acc, { election, category, amount, usd_total }) => {
      if (!acc[election]) {
        acc[election] = {
          election,
          date: historicElections.find(({ election: e }) => e === election)
            .date_election,
          eosClaimed: 0,
          eosUnclaimed: 0,
          usdClaimed: 0,
          usdUnclaimed: 0
        }
      }
      acc[election][category === 'claimed' ? 'eosClaimed' : 'eosUnclaimed'] +=
        amount
      acc[election][category === 'claimed' ? 'usdClaimed' : 'usdUnclaimed'] +=
        usd_total
      return acc
    },
    {}
  )

  return Object.values(electionsByNumber).map(
    ({ election, date, eosClaimed, eosUnclaimed, usdClaimed, usdUnclaimed }) =>
      createElection(
        election,
        date,
        eosClaimed,
        eosUnclaimed,
        usdClaimed,
        usdUnclaimed
      )
  )
}

const newDataFormatByDelegatesIncome = transactionsList =>
  transactionsList.map(data => ({
    name: data.recipient,
    EOS_CLAIMED: Number(data.eos_claimed),
    USD_CLAIMED: Number(data.usd_claimed),
    EOS_UNCLAIMED: Number(data.eos_unclaimed),
    USD_UNCLAIMED: Number(data.usd_unclaimed),
    color: generateColor()
  }))

const getData = async () => {
  const totalIncomeByDelegate = newDataFormatByDelegatesIncome(
    await incomeFrontend.getTotalIncomeByDelegate(true)
  )
  const incomeByElection = newDataFormatByElectionsIncome(
    await incomeFrontend.getIncomeByElections(true)
  )
  const dataFound = {
    data: [totalIncomeByDelegate, incomeByElection]
  }

  return dataFound
}

module.exports = {
  getData
}
