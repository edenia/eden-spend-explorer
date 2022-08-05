const { edenElectionInterval } = require('../config/eden.config');

module.exports = {
  hyperionGql: require('./hyperion-state.gql'),
  edenTransactionGql: require('./eden-transaction.gql'),
  edenDelegatesGql: require('./eden-delegates.gql'),
  edenElectionGql: require('./eden-election.gql')
}
