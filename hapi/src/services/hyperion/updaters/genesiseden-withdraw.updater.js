module.exports = {
  type: `genesis.eden:withdraw`,
  apply: async action => {
    try {
      console.log(action); 
      const transactionData = {
        txid: action.transaction_id,
        amount: action.data.amount,
        category: action.data.memo, //TODO: split this from memo
        date: action.timestamp,
        description: action.data.memo, //TODO: split this from memo
        id_election: action.idElection,
        recipient: action.data.to,
        type: 'expense' //TODO: ASK FOR THIS ONE
      }

      const registeredTransaction = await edenTransactionGql.get({
        txid: { _eq: transactionData.txid }
      });      

      if (!registeredTransaction) await edenTransactionGql.save(transactionData)
      
    } catch (error) {
      console.error(`error to sync ${action.action}: ${error.message}`)
    }
  }
}
