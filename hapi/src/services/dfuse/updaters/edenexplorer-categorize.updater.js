const { edenTransactionGql, edenElectionGql } = require('../../../gql')
const { updaterUtil } = require('../../../utils')

module.exports = {
  type: 'edenexplorer:categorize',
  apply: async action => {
    try {
      const { category, description } = updaterUtil.memoSplit(
        action.json.new_memo.split(':')[1] || ''
      )
      const transactionToEdit = edenTransactionGql.get({
        txid: { _eq: action.json.tx_id }
      })
      const { idElection: id_election } =
        await updaterUtil.getElectionWithoutExpense(
          action.delegateAccount,
          transactionToEdit.amount,
          edenElectionGql,
          edenTransactionGql
        )

      await edenTransactionGql.update({
        where: {
          txid: { _eq: action.json.tx_id },
          type: { _eq: 'expense' }
        },
        _set: { category, description, id_election }
      })
    } catch (error) {
      console.error(`categorize updater sync error: ${error.message}`)
    }
  }
}
