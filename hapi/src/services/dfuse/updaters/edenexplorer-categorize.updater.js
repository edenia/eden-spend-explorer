const {
  edenTransactionGql,
  edenElectionGql,
  edenTotalExpenseByDelegateAndElection,
  edenGlobalAmountGql
} = require('../../../gql')
const { updaterUtil } = require('../../../utils')

module.exports = {
  type: 'edenexplorer:categorize',
  apply: async action => {
    try {
      const { new_memo, tx_id, account, digest = undefined } = action.json
      const [, memo] = new_memo?.split(':') || ''

      if (!memo) return

      const { category, description } = updaterUtil.memoSplit(memo)
      const transactionToEditQuery = {
        type: { _eq: 'expense' },
        txid: { _eq: tx_id },
        ...(digest && { digest: { _eq: digest } })
      }

      const transactionToEdit = await edenTransactionGql.get(
        transactionToEditQuery
      )

      if (!transactionToEdit) return

      const { idElection: id_election } =
        await updaterUtil.getElectionWithoutExpense(account, edenElectionGql)

      const updateQuery = {
        where: {
          id: { _eq: transactionToEdit.id },
          ...(digest && { digest: { _eq: digest } })
        },
        _set: { category, description, id_election }
      }

      await edenTransactionGql.update(updateQuery)

      const existExpense = await edenTotalExpenseByDelegateAndElection.get({
        tx_id: { _eq: transactionToEdit.digest }
      })

      if (transactionToEdit.category === 'uncategorized' || !existExpense) {
        await updaterUtil.saveTotalByDelegateAndElection(
          transactionToEdit.digest,
          account,
          transactionToEdit.amount,
          transactionToEdit.eos_exchange,
          category,
          edenElectionGql,
          edenTransactionGql,
          edenTotalExpenseByDelegateAndElection,
          edenGlobalAmountGql
        )
      } else {
        await edenTotalExpenseByDelegateAndElection.update({
          where: {
            tx_id: { _eq: transactionToEdit.digest }
          },
          _set: { category }
        })
      }
    } catch (error) {
      console.error(`categorize updater sync error: ${error.message}`)
    }
  }
}
