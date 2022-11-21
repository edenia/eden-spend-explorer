const { delegateFrontend } = require('../gql')
// const { listChartColors } = require('../constants')

// let CURRENT_GRAPHIC_COLOR = 0

// const generateColor = () => {
//   if (CURRENT_GRAPHIC_COLOR === 18) CURRENT_GRAPHIC_COLOR = 0

//   const color = listChartColors[CURRENT_GRAPHIC_COLOR]
//   CURRENT_GRAPHIC_COLOR++

//   return color
// }

// const generateDelegateData = (
//   type,
//   category,
//   eos,
//   usd,
//   eosUnclass,
//   usdUnclass
// ) => {
//   const delegateData = {
//     type: type,
//     category: category,
//     EOS_: Number(eos),
//     USD_: Number(usd),
//     EOS_UN: Number(eosUnclass),
//     USD_UN: Number(usdUnclass)
//   }
//   return delegateData
// }
// const newDataFormatByTypeDelegate = (incomeList, expenseList) => {
//   const transactions = []
//   transactions.push(
//     generateDelegateData(
//       'income',
//       'Claimed',
//       incomeList[0]?.eos_claimed || 0,
//       incomeList[0]?.usd_claimed || 0,
//       incomeList[0]?.eos_unclaimed || 0,
//       incomeList[0]?.usd_unclaimed || 0
//     )
//   )
//   transactions.push(
//     generateDelegateData(
//       'expense',
//       'Categorized',
//       expenseList[0]?.eos_categorized || 0,
//       expenseList[0]?.usd_categorized || 0,
//       expenseList[0]?.eos_uncategorized || 0,
//       expenseList[0]?.usd_uncategorized || 0
//     )
//   )
//   return transactions
// }

// const newDataFormatByCategoryDelegate = categoryList =>
//   categoryList.map(data => ({
//     category: data.category,
//     EOS: Number(data.amount),
//     USD: Number(data.usd_total),
//     color: generateColor()
//   }))

const newDataFormatDelegatesByElectionDelegate = ({
  delegateList,
  incomeList
}) => {
  if (delegateList !== undefined && incomeList !== undefined) {
    return delegateList.map(delegate => {
      const posDelegate = incomeList.find(
        income => income.recipient === delegate.delegate_payer
      )
      if (posDelegate) {
        const totalIncome = posDelegate.eos_claimed + posDelegate.eos_unclaimed
        return { ...delegate, totalIncome }
      }
      return delegate
    })
  }
}

const testGetData = async () => {
  const incomeByElection = await delegateFrontend.getIncomeByElection(1, true)
  const delegates = await delegateFrontend.getDelegatesByElection(1, true)
  const levelElection = await delegateFrontend.getMaxDelegateLevel(1)
  const dateElection = await delegateFrontend.getDateByElection(1)
  console.log(dateElection)
  console.log(levelElection)
  // console.log(delegates)
  // console.log(incomeByElection)
  const dataDelegate = newDataFormatDelegatesByElectionDelegate({
    delegateList: delegates,
    incomeList: incomeByElection
  })
  dataDelegate.push(dateElection)
  dataDelegate.push(levelElection)
  console.log('=========================================================')
  console.log(dataDelegate)
}

const updateDelegateFrontend = async () => {
  await testGetData()
}

const updateDelegateFrontendWorker = () => {
  return {
    name: 'TEST_Delegate_frontend',
    action: updateDelegateFrontend
  }
}

module.exports = {
  updateDelegateFrontendWorker
}
