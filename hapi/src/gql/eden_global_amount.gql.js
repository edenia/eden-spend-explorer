const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: global_amount_insert_input!) {
      insert_global_amount_one(object: $payload) {
        id 
        eos_income
        usd_income
        usd_expense
        eos_expense
        election
        account     
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_global_amount_one
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: global_amount_bool_exp) {
      global_amount(where: $where) {
        id
        eos_income
        usd_income
        usd_expense
        eos_expense
        election
        account
      }
    }
  `
  const { global_amount } = await hasuraUtil.instance.request(query, {
    where
  })

  return getMany ? global_amount : global_amount[0]
}

const update = async ({ where, _set }) => {
  const mutation = `
    mutation update($where: global_amount_bool_exp!, $_set: global_amount_set_input) {
      update_global_amount(where: $where, _set: $_set) {
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

  return data.update_eden_transaction
}

const getAggregate = async where => {
  const query = `
  query ($where: global_amount_bool_exp) {
    global_amount_aggregate(where: $where) {
      aggregate {
        sum {
          eos_income
          usd_income
        }
      }
    }
  }
  `
  const { global_amount } = await hasuraUtil.instance.request(query, {
    where
  })

  return global_amount?.aggregate?.sum || {}
}

module.exports = {
  save,
  get,
  update,
  getAggregate
}
