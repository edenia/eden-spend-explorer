const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_transaction_insert_input!) {
      insert_eden_transaction_one(object: $payload) {
        id
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_eden_transaction_one
}

const get = async (where, getMany = false) => {
  const query = `
  query ($where: eden_transaction_bool_exp) {
    eden_transaction(where: $where) {
      amount
      category
      created_at
      date
      description
      id
      id_election
      recipient
      txid
      type
      updated_at
    }
  }
  `
  const { eden_transaction: edenTransaction }  = await hasuraUtil.instance.request(
    query,
    {
      where
    }
  )
  
  return getMany ? edenTransaction : edenTransaction[0]
}

module.exports = {
  save,
  get,
}
