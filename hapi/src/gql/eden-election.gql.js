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

const update = async ({ where, _set }) => {
  const mutation = `
    mutation update($where: eden_election_bool_exp!, $_set: eden_election_set_input) {
      update_eden_election(where: $where, _set: $_set) {
        returning {
          id
        }
      }
    }
  `

  const data = await hasuraUtil.instance.request(mutation, {
    where,
    _set
  })

  return data.update_eden_election
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: eden_election_bool_exp) {
      eden_election(where: $where) {
        id
        id_delegate
        delegate_level
        election_round
        created_at
        updated_at
      }
    }
  `
  const { eden_election: edenElection } = await hasuraUtil.instance.request(
    query,
    {
      where
    }
  )

  return getMany ? edenElection : edenElection[0]
}

module.exports = {
  save,
  update,
  get
}
