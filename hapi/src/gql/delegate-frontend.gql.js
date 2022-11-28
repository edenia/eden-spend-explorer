const { hasuraUtil } = require('../utils')

const getDelegatesByElection = async (election, getMany = false) => {
  const query = `
    query getDelegatesByElection($election: Int) {
      transaction_by_category_and_election(
        where: { election: { _eq: $election } }
        distinct_on: delegate_payer
      ) {
        delegate_payer
        delegate_level
      }
    }
  `

  const { transaction_by_category_and_election: getDelegatesByElection } =
    await hasuraUtil.instance.request(query, { election })

  return getMany ? getDelegatesByElection : getDelegatesByElection[0]
}

const getMaxDelegateLevel = async (election, getMany = false) => {
  const query = `
    query getMaxDelegateLevel($election: Int) {
      eden_election(
        where: { election: { _eq: $election } }
        order_by: { delegate_level: desc }
        limit: 1
      ) {
        delegate_level
      }
    }
  `

  const { eden_election: getMaxDelegateLevel } =
    await hasuraUtil.instance.request(query, { election })

  return getMany ? getMaxDelegateLevel : getMaxDelegateLevel[0]
}

const getIncomeByElection = async (election, getMany = false) => {
  const query = `
    query getIncomeByElection($election: Int) {
      historic_incomes(where: { election: { _eq: $election } }) {
        recipient
        eos_claimed
        eos_unclaimed
      }
    }
  `

  const { historic_incomes: getIncomeByElection } =
    await hasuraUtil.instance.request(query, { election })

  return getMany ? getIncomeByElection : getIncomeByElection[0]
}

const getDateByElection = async (election, getMany = false) => {
  const query = `
    query getDateElection($election: Int) {
      eden_historic_election(where: { election: { _eq: $election } }) {
        date_election
      }
    }
  `

  const { eden_historic_election: getDateByElection } =
    await hasuraUtil.instance.request(query, { election })

  return getMany ? getDateByElection : getDateByElection[0]
}

module.exports = {
  getDelegatesByElection,
  getMaxDelegateLevel,
  getIncomeByElection,
  getDateByElection
}
