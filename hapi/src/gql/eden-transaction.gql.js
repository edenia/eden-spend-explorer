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
      eos_exchange
      digest
    }
  }
  `
  const { eden_transaction: edenTransaction } =
    await hasuraUtil.instance.request(query, {
      where
    })

  return getMany ? edenTransaction : edenTransaction[0]
}

const deleteTx = async where => {
  const mutation = `
  mutation ($where: eden_transaction_bool_exp!) {
    delete_eden_transaction(where: $where) {
      returning {
        txid
      }
    }
  }
  `
  const data = await hasuraUtil.instance.request(mutation, { where })

  return data.delete_eden_transaction
}

const update = async ({ where, _set }) => {
  const mutation = `
    mutation update($where: eden_transaction_bool_exp!, $_set: eden_transaction_set_input) {
      update_eden_transaction(where: $where, _set: $_set) {
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

const getHistoricIncome = async (where, getMany = false) => {
  const query = `
  query ($where: historic_incomes_bool_exp) {
    historic_incomes(where: $where) {
      recipient
      eos_claimed
      usd_claimed
      eos_unclaimed
      usd_unclaimed
      election
      delegate_level
    }
  }`

  const { historic_incomes: historicIncomes } =
    await hasuraUtil.instance.request(query, {
      where
    })

  return getMany ? historicIncomes : historicIncomes[0]
}

const getAggregate = async where => {
  const query = `
  query ($where: eden_transaction_bool_exp) {
    eden_transaction_aggregate(where: $where, distinct_on: txid) {
      aggregate {
        sum {
          amount
          usd_total
        }
      }
    }
  }
  `
  const { eden_transaction_aggregate: edenTransactionAggregate } =
    await hasuraUtil.instance.request(query, {
      where
    })

  return edenTransactionAggregate?.aggregate?.sum || {}
}

module.exports = {
  save,
  get,
  deleteTx,
  update,
  getAggregate,
  getHistoricIncome
}
