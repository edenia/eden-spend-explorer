import React, { memo } from 'react'
import TreasuryBalance from '../../components/TreasuryBalance'

const ExpenseReport = () => {
  return (
    <div>
      ExpenseReport
      <TreasuryBalance />
    </div>
  )
}

export default memo(ExpenseReport)
