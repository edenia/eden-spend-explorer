module.exports = {
  edenElectionInterval:
    parseInt(process.env.HAPI_EDEN_ELECTION_INTERVAL) || 7889400 // 3 Month
}
