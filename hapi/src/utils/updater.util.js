const { transactionConstant } = require('../constants')

const isEdenExpense = memoString => {
  const memoSplit = memoString.split(':')
  return memoSplit[0].toLowerCase() === 'eden_expense'
}

const memoSplit = memoString => {
  const memoSplit = memoString.split('/')
  const category = transactionConstant.CATEGORIES.includes(
    memoSplit[0].toLowerCase().trim()
  )
    ? memoSplit[0]
    : 'uncategorized'
  const description = category !== 'uncategorized' ? memoSplit[1] : memoString

  return { category, description }
}

const getElectionWithoutExpense = async (
  delegateAccount,
  amount,
  edenElectionGql,
  edenTransactionGql
) => {
  try {
    const electionsQuery = {
      eden_delegate: { account: { _eq: delegateAccount } }
    }
    const elections = await edenElectionGql.get(electionsQuery, true)

    for (const { id, election } of elections) {
      const incomeQuery = {
        eden_election: {
          eden_delegate: { account: { _eq: delegateAccount } },
          election: { _eq: election }
        },
        type: { _eq: 'income' }
      }
      const expenseQuery = {
        eden_election: {
          eden_delegate: { account: { _eq: delegateAccount } },
          election: { _eq: election }
        },
        type: { _eq: 'expense' },
        category: { _neq: 'uncategorized' }
      }

      const { amount: income } =
        (await edenTransactionGql.getAggregate(incomeQuery)) || 0

      const { amount: expense } =
        (await edenTransactionGql.getAggregate(expenseQuery)) || 0

      if (expense + amount <= income) {
        return { election, idElection: id }
      }
    }

    return {
      election: elections.at(-1).election,
      idElection: elections.at(-1).id
    }
  } catch (error) {
    console.error('An error occurred in getElectionWithoutExpense: ', error)
  }
}

const saveTotalByDelegateAndElection = async (
  txId,
  delegateAccount,
  eosAmount,
  eosRate,
  category,
  edenElectionGql,
  edenTransactionGql,
  edenTotalExpenseByDelegateAndElection,
  edenGlobalAmountGql
) => {
  try {
    let tempAmount = eosAmount
    const electionsQuery = {
      eden_delegate: { account: { _eq: delegateAccount } }
    }
    const elections = await edenElectionGql.get(electionsQuery, true)

    for (const { id, election } of elections) {
      const incomeQuery = {
        eden_election: {
          eden_delegate: { account: { _eq: delegateAccount } },
          election: { _eq: election }
        },
        type: { _eq: 'income' }
      }

      const totalByDelegateAndElectionQuery = {
        id_election: { _eq: id }
      }

      const globalAmountQuery = {
        election: { _eq: election },
        account: { _eq: delegateAccount }
      }

      const { amount, usd_total } =
        (await edenTransactionGql.getAggregate(incomeQuery)) || 0

      const totalByDelegateAndElection =
        (await edenTotalExpenseByDelegateAndElection.getAggregate(
          totalByDelegateAndElectionQuery
        )) || 0

      let globalAmount = await edenGlobalAmountGql.get(globalAmountQuery)

      if (!globalAmount) {
        globalAmount = await edenGlobalAmountGql.save({
          account: delegateAccount,
          election,
          eos_income: amount,
          usd_income: usd_total,
          eos_expense: 0,
          usd_expense: 0
        })
      }

      if (totalByDelegateAndElection + tempAmount > amount) {
        const totalToSave = amount - totalByDelegateAndElection

        const totalByDelegateAndElectionData = {
          eos_amount: totalToSave,
          usd_amount: totalToSave * eosRate,
          id_election: id,
          category,
          tx_id: txId,
          election,
          account: delegateAccount
        }

        await edenGlobalAmountGql.update({
          where: globalAmountQuery,
          _set: {
            eos_expense: Number(globalAmount.eos_expense + totalToSave).toFixed(
              2
            ),
            usd_expense: Number(
              globalAmount.usd_expense + totalToSave * eosRate
            ).toFixed(2)
          }
        })

        await edenTotalExpenseByDelegateAndElection.save(
          totalByDelegateAndElectionData
        )

        tempAmount = tempAmount - totalToSave
      } else {
        const totalByDelegateAndElectionData = {
          eos_amount: tempAmount,
          usd_amount: tempAmount * eosRate,
          id_election: id,
          category,
          tx_id: txId,
          election,
          account: delegateAccount
        }

        await edenGlobalAmountGql.update({
          where: globalAmountQuery,
          _set: {
            eos_expense: Number(globalAmount.eos_expense + tempAmount).toFixed(
              2
            ),
            usd_expense: Number(
              globalAmount.usd_expense + tempAmount * eosRate
            ).toFixed(2)
          }
        })

        await edenTotalExpenseByDelegateAndElection.save(
          totalByDelegateAndElectionData
        )

        return
      }
    }
  } catch (error) {
    console.error(
      'An error occurred in saveTotalByDelegateAndElection: ',
      error
    )
  }
}

module.exports = {
  memoSplit,
  isEdenExpense,
  getElectionWithoutExpense,
  saveTotalByDelegateAndElection
}
