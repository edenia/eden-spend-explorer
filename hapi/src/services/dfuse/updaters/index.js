const genesisEdenFundTransfer = require('./genesiseden-fundtransfer.updater')
const eosioTokenTransferUpdater = require('./eosiotoken-transfer.updater')
const edenExplorerCategorize = require('./edenexplorer-categorize.updater')

module.exports = [
  genesisEdenFundTransfer,
  eosioTokenTransferUpdater,
  edenExplorerCategorize
]
