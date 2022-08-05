const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_account_insert_input!) {
      insert_eden_account_one(object: $payload) {
        txid
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_eden_account_one
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: eden_account_bool_exp) {
      eden_account(where: $where) {
        txid
        date
        type
        delegate
        election
        amount
        recipient
        category
        description
      }
    }
  `
  const { eden_transaction: edenTransaction } = await hasuraUtil.instance.request(
    query,
    {
      where
    }
  )

  return getMany ? edenTransaction : edenTransaction[0]
}

module.exports = {
  save,
  get
}
