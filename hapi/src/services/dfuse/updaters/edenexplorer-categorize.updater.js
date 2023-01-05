const { edenTransactionGql, edenElectionGql } = require('../../../gql')
const { updaterUtil } = require('../../../utils')

module.exports = {
  type: 'edenexplorer:categorize',
  apply: async action => {
    try {
      const { new_memo, tx_id, account } = action.json
      const [, memo] = new_memo?.split(':') || ''

      if (!memo) return

      const { category, description } = updaterUtil.memoSplit(memo)
      const transactionToEditQuery = {
        txid: { _eq: tx_id },
        type: { _eq: 'expense' },
        eden_election: { eden_delegate: { account: { _eq: account } } }
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
          type: { _eq: 'expense' }
        },
        _set: { category, description, id_election }
      }

      await edenTransactionGql.update(updateQuery)
    } catch (error) {
      console.error(`categorize updater sync error: ${error.message}`)
    }
  }
}
