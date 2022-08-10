const { axiosUtil } = require('../utils')
const { eosConfig } = require('../config')

const isEdenExpense = (memoString) => {
   try {
    let splitMemo = memoString.split(":")
    return splitMemo[0].toLowerCase() === "eden_expense"
   } catch (error) {
    return false
   }
}
  
const memoSplit = (memoString) => {
    const categories  = ['admin', 'charity', 'development', 'dues', 'education', 'hardware', 'infrastructure', 'legal', 'marketing', 'pomelo', 'salaries', 'software', 'travel']
    const memoSplit   = memoString.split("/")
    const category    = categories.includes(memoSplit[0].toLowerCase()) ? memoSplit[0] : 'uncategorized'
    const description = category !== 'uncategorized' ? memoSplit[1] : memoString

    return { category, description }
}

const getHistoryEos = async params => {

    const data = await axiosUtil.get(
        `${ eosConfig.eosHistory }`,
        {
            params: {
                id: 'eos',
                date: '03-08-2022',
                localization: false
            }
        }
  )

  console.log(data, 'la data'); 
}

module.exports = { 
    memoSplit, 
    isEdenExpense,
    getHistoryEos,
}