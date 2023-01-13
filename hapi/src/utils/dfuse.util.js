global.WebSocket = require('ws')
const { createDfuseClient } = require('@dfuse/client')

const { dfuseConfig } = require('../config')

const getfundTransferQuery = ({ query, lowBlockNum }) => {
  const operator = `query {
  searchTransactionsForward(query: "${query}" limit: 1000,${
    lowBlockNum ? `lowBlockNum:${lowBlockNum},` : ''
  } irreversibleOnly: true) {
    results {
      isIrreversible
      trace {
        block {
          num
          confirmed
          timestamp
        }
        id
        matchingActions {
          receipt {
            digest
          }
          account
          name
          json
          receiver
        }
      }
    }
  }
}`

  return operator
}

const client = createDfuseClient({
  apiKey: dfuseConfig.apiKey,
  network: dfuseConfig.api
})

module.exports = { client, getfundTransferQuery }
