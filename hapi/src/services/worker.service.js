const { hasuraUtil } = require('../utils')

const dfuseService = require('./dfuse/index')
const edenDelegatesService = require('./eden-delegates.service')
const edenHistoricDelegateService = require('./eden-historic-delegates.service')
const edenUnclaimedFundsService = require('./eden-unclaimed-funds.service')

const MAX_TIMEOUT_MS = 2147483.647

const sleep = seconds => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds * 1000)
  })
}

const run = async ({ name, action, interval }) => {
  const intervalTime = interval ? await interval() : undefined

  try {
    await action()
  } catch (error) {
    console.log(`${name} ERROR =>`, error.message)
  }

  console.log(`COMPLETED ${name} WORKER`)

  if (!intervalTime) {
    return
  }

  console.log(`${name} WORKER WILL RUN AGAIN IN ${intervalTime / 60} MINUTES`)

  let partialInterval = intervalTime

  while (partialInterval > 0) {
    const tempInterval =
      partialInterval > MAX_TIMEOUT_MS ? MAX_TIMEOUT_MS : partialInterval

    await sleep(tempInterval)

    partialInterval -= tempInterval
  }

  run({ name, action, interval })
}

const init = async () => {
  await hasuraUtil.hasuraAssembled()
  await run(edenHistoricDelegateService.updateHistoricDelegatesWorker())
  await run(edenUnclaimedFundsService.updateEdenUncleimedFundsWorker2())
  run(edenDelegatesService.updateEdenTableWorker())
  run(edenUnclaimedFundsService.updateEdenUncleimedFundsWorker())
  run(dfuseService.syncWorker())
}

module.exports = {
  init
}
