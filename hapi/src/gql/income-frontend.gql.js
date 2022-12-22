const { hasuraUtil } = require('../utils')

const getTotalIncomeByDelegate = async (getMany = false) => {
  const query = `
    query getTotalIncomeByDelegate {
      incomes_by_delegate {
        recipient
        eos_claimed
        usd_claimed
        eos_unclaimed
        usd_unclaimed
      }
    }
  `

  const { incomes_by_delegate: getTotalIncomeByDelegate } =
    await hasuraUtil.instance.request(query)

  return getMany ? getTotalIncomeByDelegate : getTotalIncomeByDelegate[0]
}

const getIncomeByElections = async () => {
  const query = `
    query getIncomeByElections {
      total_by_category_and_election(
        where: { type: { _eq: "income" } }
        order_by: { election: asc, category: asc }
      ) {
        election
        category
        amount
        usd_total
      }
      eden_historic_election {
        election
        date_election
      }
    }
  `

  const getIncomeByElections = await hasuraUtil.instance.request(query)

  return getIncomeByElections
}

module.exports = {
  getTotalIncomeByDelegate,
  getIncomeByElections
}
