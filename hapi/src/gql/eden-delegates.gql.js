const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_delegates_insert_input!) {
      insert_eden_delegates_one(object: $payload) {
        id,
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
        id
        account
        created_at
        updated_at
        last_synced_at
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

const update = async (id, data) => {
  const mutation = `
  mutation ($id: uuid!, $payload: eden_delegates_set_input) {
    update_eden_delegates_by_pk(pk_columns: {id: $id}, _set: $payload) {
      id
      last_synced_at
    }
  }
  `

  await hasuraUtil.instance.request(mutation, {
    id,
    payload: data
  })
}

module.exports = {
  save,
  get,
  update
}
