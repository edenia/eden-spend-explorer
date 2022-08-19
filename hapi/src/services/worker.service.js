const { hasuraUtil } = require('../utils')

const hyperionService = require('./hyperion')
const edenDelegatesService = require('./eden-delegates.service')
const edenElectionService = require('./eden-election.service')

const MAX_TIMEOUT_MS = 2147483.647

const sleep = seconds => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), seconds * 1000)
  })
}

const run = async ({ name, action, interval }) => {
  try {
    await action()
  } catch (error) {
    console.log(`${name} ERROR =>`, error.message)
  }

  console.log(`COMPLETED ${name} WORKER`)

  if (!interval) {
    return
  }

  console.log(`${name} WORKER WILL RUN AGAIN IN ${interval / 60} MINUTES`)

  let partialInterval = interval

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

  // run(hyperionService.syncWorker())
  // run(edenDelegatesService.updateEdenTableWorker())
  // run(edenElectionService.updateEdenElection())
}

module.exports = {
  init
}
