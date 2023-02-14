const { hasuraUtil } = require('../utils')

const save = async payload => {
  const mutation = `
    mutation ($payload: total_expense_by_delegate_and_election_insert_input!) {
      insert_total_expense_by_delegate_and_election_one(object: $payload) {
        id      
      }
    }
  `
  const data = await hasuraUtil.instance.request(mutation, { payload })

  return data.insert_total_expense_by_delegate_and_election_one
}

const get = async (where, getMany = false) => {
  const query = `
    query ($where: total_expense_by_delegate_and_election_bool_exp) {
      total_expense_by_delegate_and_election(where: $where) {
        id
        eos_amount
        usd_amount
        id_election
        category
      }
    }
  `
  const { total_expense_by_delegate_and_election } =
    await hasuraUtil.instance.request(query, {
      where
    })

  return getMany
    ? total_expense_by_delegate_and_election
    : total_expense_by_delegate_and_election[0]
}

const update = async ({ where, _set }) => {
  const mutation = `
    mutation update($where: total_expense_by_delegate_and_election_bool_exp!, $_set: total_expense_by_delegate_and_election_set_input) {
      update_total_expense_by_delegate_and_election(where: $where, _set: $_set) {
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
  query ($where: total_expense_by_delegate_and_election_bool_exp) {
    total_expense_by_delegate_and_election_aggregate(where: $where) {
      aggregate {
        sum {
          eos_amount
        }
      }
    }
  }
  `
  const { total_expense_by_delegate_and_election } =
    await hasuraUtil.instance.request(query, {
      where
    })

  return total_expense_by_delegate_and_election?.aggregate?.sum?.eos_amount || 0
}

module.exports = {
  save,
  get,
  update,
  getAggregate
}
