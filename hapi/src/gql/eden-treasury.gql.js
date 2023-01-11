const { hasuraUtil } = require('../utils')

const get = async (where, getMany = false) => {
  const query = `
    query MyQuery($where: eden_treasury_bool_exp) {
      eden_treasury(where: $where) {
        amount
        balance
        created_at
        date
        eos_exchange
        id
        last_synced_at
        txid
        type
        updated_at
        usd_total
      }
    }
  `
  const { eden_treasury: edenTreasury } = await hasuraUtil.instance.request(
    query,
    {
      where
    }
  )

  return getMany ? edenTreasury : edenTreasury[0]
}

const save = async payload => {
  const mutation = `
    mutation ($payload: eden_treasury_insert_input!) {
      insert_eden_treasury_one(object: $payload) {
        id
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_eden_treasury_one
}

module.exports = {
  save,
  get
}
