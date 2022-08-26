const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_election_insert_input!) {
      insert_eden_election_one(object: $payload) {
        election_round
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_eden_election_one
}

const get = async (date, getMany = false) => {
  const query = `
    query ($date: timestamptz) {
      eden_historic_election(where: {date_election: {_lte: $date}}, limit: 1, order_by: {date_election: desc}) {
        id
        election_round
        date_election
        created_at
        updated_at
      }
    }
  `
  const { eden_historic_election: edenHistoricElection } =
    await hasuraUtil.instance.request(query, {
      date
    })

  return getMany ? edenHistoricElection : edenHistoricElection[0]
}

module.exports = {
  save,
  get
}
