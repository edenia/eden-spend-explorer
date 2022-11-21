const { delegateFrontend } = require('../gql')

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

const getData = async election => {
  const incomeByElection = await delegateFrontend.getIncomeByElection(
    election,
    true
  )
  const delegates = await delegateFrontend.getDelegatesByElection(
    election,
    true
  )
  const levelElection = await delegateFrontend.getMaxDelegateLevel(election)
  const dateElection = await delegateFrontend.getDateByElection(election)
  const dataDelegate = newDataFormatDelegatesByElectionDelegate({
    delegateList: delegates,
    incomeList: incomeByElection
  })
  dataDelegate.push(dateElection)
  dataDelegate.push(levelElection)
  const dataFound = {
    data: dataDelegate
  }
  return dataFound
}

module.exports = {
  getData
}
