// const { v4: uuidv4 } = require('uuid')

const { edenTransactionGql } = require('../../../gql')
const { edenConfig } = require('../../../config')
const { communityUtil } = require('../../../utils')

module.exports = {
  type: `${edenConfig.edenContract}:fundtransfer`,
  apply: async action => {
    try {
      const amount = Number(action.json.amount.split(' ')[0])
      const existTx = await communityUtil.existFundTransfer(
        edenTransactionGql,
        amount,
        action.json.distribution_time,
        action.json.from
      )

      if (!existTx) {
        const transactionData = {
          txid: action.transaction_id,
          amount,
          category: 'claimed',
          date: action.json.distribution_time,
          description: action.json.memo,
          id_election: action.election.id,
          recipient: action.json.from,
          type: 'income',
          eos_exchange: action.eosPrice,
          usd_total: amount * action.eosPrice
        }

        await edenTransactionGql.save(transactionData)
      } else {
        await edenTransactionGql.update({
          where: {
            id: { _eq: existTx.id }
          },
          _set: { txid: action.transaction_id }
        })
      }
    } catch (error) {
      console.error(
        `fundtransfer sync error ${action.action}: ${error.message}`
      )
    }
  }
}
