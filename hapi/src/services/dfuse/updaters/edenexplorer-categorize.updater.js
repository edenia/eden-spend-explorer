const {
  edenTransactionGql,
  edenElectionGql,
  edenTotalExpenseByDelegateAndElection
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
        txid: { _eq: tx_id },
        ...(digest && { digest: { _eq: digest } })
      }

      const transactionToEdit = await edenTransactionGql.get(
        transactionToEditQuery
      )

      if (!transactionToEdit) return

      const { idElection: id_election } =
        await updaterUtil.getElectionWithoutExpense(
          account,
          transactionToEdit.amount,
          edenElectionGql,
          edenTransactionGql
        )

      const updateQuery = {
        where: {
          id: { _eq: transactionToEdit.id },
          ...(digest && { digest: { _eq: digest } })
        },
        _set: { category, description, id_election }
      }

      await edenTransactionGql.update(updateQuery)
      if (transactionToEdit.category === 'uncategorzed') {
        await updaterUtil.saveTotalByDelegateAndElection(
          transactionToEdit.txid,
          account,
          transactionToEdit.amount,
          transactionToEdit.eos_exchange,
          transactionToEdit.category,
          edenElectionGql,
          edenTransactionGql,
          edenTotalExpenseByDelegateAndElection
        )
      } else {
        await edenTotalExpenseByDelegateAndElection.update({
          where: {
            tx_id: { _eq: transactionToEdit.txid }
          },
          _set: { category }
        })
      }
    } catch (error) {
      console.error(`categorize updater sync error: ${error.message}`)
    }
  }
}
