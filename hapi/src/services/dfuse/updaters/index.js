const genesisEdenWithdrawUpdater = require('./genesiseden-withdraw.updater')
const genesisEdenFundTransfer = require('./genesiseden-fundtransfer.updater')
const eosioTokenTransferUpdater = require('./eosiotoken-transfer.updater')
const edenExplorerCategorize = require('./edenexplorer-categorize.updater')

module.exports = [
  genesisEdenWithdrawUpdater,
  genesisEdenFundTransfer,
  eosioTokenTransferUpdater,
  edenExplorerCategorize
]
