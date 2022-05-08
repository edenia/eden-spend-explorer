const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_delegates_insert_input!) {
      insert_eden_delegates_one(object: $payload) {
        account
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_eden_delegates_one
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: eden_delegates_bool_exp) {
      eden_delegates(where: $where) {
        account
        election_round
        delegate_level
      }
    }
  `
  const { eden_delegates: edenDelegates } = await hasuraUtil.instance.request(
    query,
    {
      where
    }
  )

  return getMany ? edenDelegates : edenDelegates[0]
}

module.exports = {
  save,
  get
}
