const { edenTransactionGql } = require('../../../gql')
const { updaterUtil } = require('../../../utils')

module.exports = {
  type: 'edenexplorer:categorize',
  apply: async action => {
    const { category, description } = updaterUtil.memoSplit(
      action.json.new_memo.split(':')[1] || ''
    )

    await edenTransactionGql.update({
      where: {
        txid: { _eq: action.json.tx_id },
        type: { _eq: 'expense' }
      },
      _set: { category, description }
    })
  }
}
