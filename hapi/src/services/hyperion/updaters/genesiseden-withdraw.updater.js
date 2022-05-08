module.exports = {
  type: `genesis.eden:withdraw`,
  apply: async action => {
    try {
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
