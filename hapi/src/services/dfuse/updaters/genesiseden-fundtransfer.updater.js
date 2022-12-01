const { v4: uuidv4 } = require('uuid')

const { edenTransactionGql, edenHistoricElectionGql } = require('../../../gql')
const { edenConfig } = require('../../../config')

module.exports = {
  type: `${edenConfig.edenContract}:fundtransfer`,
  apply: async action => {
    try {
      const withdrawElection = await edenHistoricElectionGql.get({
        date_election: { _lte: action.timestamp }
      })
      const existTx = await edenTransactionGql.get({
        date: { _eq: action.json.distribution_time },
        eden_election: {
          delegate_level: { _eq: action.json.rank },
          eden_delegate: { account: { _eq: action.json.from } }
        }
      })
      const amount = Number(action.json.amount.split(' ')[0])
      const transactionData = {
        txid: uuidv4(),
        amount,
        category: 'claimed',
        date: action.json.distribution_time,
        description: action.json.memo,
        id_election: action.election.id,
        recipient: action.json.to,
        type: 'income',
        eos_exchange: action.eosPrice,
        usd_total: amount * action.eosPrice
      }
      if (!existTx && withdrawElection.election !== action.election.election) {
        await edenTransactionGql.save(transactionData)
      } else {
        await edenTransactionGql.deleteTx({
          date: { _eq: transactionData.date },
          eden_election: {
            delegate_level: { _eq: action.json.rank },
            eden_delegate: { account: { _eq: transactionData.recipient } }
          }
        })
      }
    } catch (error) {
      console.error(
        `fundtransfer sync error ${action.action}: ${error.message}`
      )
    }
  }
}
