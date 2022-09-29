const genesisEdenWithdrawUpdater = require('./genesiseden-withdraw.updater')
const genesisEdenFundTransfer = require('./genesiseden-fundtransfer.updater')
const eosioTokenTransferUpdater = require('./eosiotoken-transfer.updater')

module.exports = [
  genesisEdenWithdrawUpdater,
  genesisEdenFundTransfer,
  eosioTokenTransferUpdater
]
