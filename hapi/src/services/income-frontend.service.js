const { incomeFrontend } = require('../gql')
const { listChartColors } = require('../constants')

let CURRENT_GRAPHIC_COLOR = 0

const generateColor = () => {
  if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

  const color = listChartColors.LISTCHARTCOLORS[CURRENT_GRAPHIC_COLOR]
  CURRENT_GRAPHIC_COLOR++

  return color
}

const newDataFormatByElectionsIncome = electionsList => {
  const elections = []
  for (let pos = 0; pos < electionsList.length; pos = pos + 2) {
    const election = {
      election: `Election ${electionsList[pos].election + 1}`,
      EOS_CLAIMED: Number(electionsList[pos].amount),
      EOS_UNCLAIMED: Number(electionsList[pos + 1]?.amount),
      USD_CLAIMED: Number(electionsList[pos].usd_total),
      USD_UNCLAIMED: Number(electionsList[pos + 1]?.usd_total),
      EOS_TOTAL: Number(
        electionsList[pos].amount + electionsList[pos + 1]?.amount
      ),
      USD_TOTAL: Number(
        electionsList[pos].usd_total + electionsList[pos + 1]?.usd_total
      )
    }
    elections.push(election)
  }

  return elections
}

const newDataFormatPercentAllElections = percentAllElectionData => {
  const uppercaseCategory = 'claimed'.toUpperCase()

  return percentAllElectionData.map(data => ({
    name: `Election ${data.election + 1}`,
    [`EOS_${uppercaseCategory}_PERCENT`]:
      Number(data[`eos_${'claimed'}`]) * 100,
    [`EOS_UN${uppercaseCategory}_PERCENT`]:
      Number(data[`eos_un${'claimed'}`]) * 100
  }))
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

  const percentAllElections = newDataFormatPercentAllElections(
    await incomeFrontend.getPercentAllElections(true)
  )

  const incomeByElection = newDataFormatByElectionsIncome(
    await incomeFrontend.getIncomeByElections(true)
  )

  const dataFound = {
    data: [totalIncomeByDelegate, percentAllElections, incomeByElection]
  }

  return dataFound
}

module.exports = {
  getData
}
