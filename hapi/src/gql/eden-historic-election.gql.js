const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_historic_election_insert_input!) {
      insert_eden_historic_election_one(object: $payload) {
        election
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_eden_historic_election_one
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: eden_historic_election_bool_exp) {
      eden_historic_election(where: $where, limit: 1, order_by: {date_election: desc}) {
        id
        election
        date_election
        created_at
        updated_at
      }
    }
  `
  const { eden_historic_election: edenHistoricElection } =
    await hasuraUtil.instance.request(query, {
      where
    })

  return getMany ? edenHistoricElection : edenHistoricElection[0]
}

module.exports = {
  save,
  get
}
