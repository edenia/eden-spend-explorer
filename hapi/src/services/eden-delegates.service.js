const updateEdenTable = async () => {}

const updateEdenTableWorker = () => {
  return {
    name: 'SYNC ACTIONS',
    interval: affiliateConfig.updateRequesterInterval,
    action: sync
  }
}

module.export = {
  updateEdenTableWorker
}
