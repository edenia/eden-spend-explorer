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

const getElectionWithoutExpense = async (delegateAccount, edenElectionGql) => {
  try {
    const electionsQuery = {
      eden_delegate: { account: { _eq: delegateAccount } }
    }
    const elections = await edenElectionGql.get(electionsQuery, true)

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
      const globalAmountQuery = {
        election: { _eq: election },
        account: { _eq: delegateAccount }
      }

      const { eos_claimed, eos_unclaimed, usd_claimed, usd_unclaimed } =
        await edenTransactionGql.getHistoricIncome({
          election: { _eq: election },
          recipient: { _eq: delegateAccount }
        })

      const amount = eos_claimed + eos_unclaimed || 0
      const usd_total = usd_claimed + usd_unclaimed || 0

      let globalAmount = await edenGlobalAmountGql.get(globalAmountQuery)

      if (!globalAmount) {
        globalAmount = await edenGlobalAmountGql.save({
          account: delegateAccount,
          election,
          eos_income: Number(amount).toFixed(2),
          usd_income: Number(usd_total).toFixed(2),
          eos_expense: 0,
          usd_expense: 0
        })
      }

      if (globalAmount.eos_expense >= globalAmount.eos_income) continue

      if (tempAmount < 0) console.log(tempAmount, 'tempAmount')

      if (globalAmount.eos_expense + tempAmount > amount) {
        const totalToSave = globalAmount.eos_income - globalAmount.eos_expense

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

        if (totalToSave < 0) console.log(totalToSave, 'Total To Save')
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
