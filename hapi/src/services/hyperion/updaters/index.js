const genesisEdenWithdrawUpdater = require('./genesiseden-withdraw.updater')
const eosioTokenTransferUpdater = require('./eosiotoken-transfer.updater')
const genesisEdenFundTransferUpdater = require('./genesis-fundtransfer.updater')

module.exports = [
  genesisEdenWithdrawUpdater,
  genesisEdenFundTransferUpdater,
  eosioTokenTransferUpdater
]
