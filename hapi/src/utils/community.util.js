const moment = require('moment')

const { edenConfig, eosConfig } = require('../config')
const { servicesConstant } = require('../constants')

const { getTableRows } = require('./eos.util')
const { get } = require('./axios.util')

const nextElectionDate = async () => {
  try {
    const response = await loadTableData({ next_key: null }, 'elect.curr')
    const nextElection = response.rows[0]
    const now = moment(new Date())
    const end = moment(nextElection[1].start_time).add(1, 'day')
    const duration = moment.duration(end.diff(now)).asSeconds()

    return duration > 0 ? duration : servicesConstant.INTERVALS.oneHour
  } catch (error) {
    console.log(error)

    return servicesConstant.INTERVALS.oneHour
  }
}

const nextDistributionDate = async () => {
  try {
    const response = await loadTableData({ next_key: null }, 'distribution')

    const nextDistribution = response.rows[0]

    const now = moment(new Date())
    const end = moment(nextDistribution[1].distribution_time).add(1, 'day')
    const duration = moment.duration(end.diff(now)).asSeconds()

    return duration > 0 ? duration : servicesConstant.INTERVALS.oneHour
  } catch (error) {
    console.log(error)

    return servicesConstant.INTERVALS.oneHour
  }
}

const loadTableData = async (
  { next_key: nextKey = null, limit = 100 } = {},
  table
) => {
  return await getTableRows({
    code: edenConfig.edenContract,
    scope: 0,
    table,
    limit,
    lower_bound: nextKey
  })
}

const getExchangeRateByDate = async txDate => {
  const { data } = await get(`${eosConfig.eosHistory}/coins/eos/history`, {
    params: {
      date: txDate,
      localization: false
    }
  })

  return data
}

const saveNewElection = async edenHistoricElectionGql => {
  const currentDate = moment().format()
  const lastElection = await edenHistoricElectionGql.get({
    date_election: { _lte: currentDate }
  })

  const electState = await loadTableData({ next_key: null }, 'elect.state')
  const electStateData = electState.rows[0]
  const nextElection = electStateData[1].last_election_time.split('T')[0]

  if (lastElection.date_election.split('T')[0] === nextElection) return

  await edenHistoricElectionGql.save({
    election: lastElection.election + 1,
    date_election: nextElection
  })
}

module.exports = {
  nextElectionDate,
  nextDistributionDate,
  loadTableData,
  getExchangeRateByDate,
  saveNewElection
}
