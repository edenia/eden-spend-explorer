import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'

import StackedBarChartReport from '../../components/StackedBarChartReport'
import PieChartReport from '../../components/PieChartReport'
import styles from './styles'

const useStyles = makeStyles(styles)

const DelegateDetails = ({ categoryList, transactionList }) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.chartContainer}>
        <div className={classes.pieChartContainer}>
          <PieChartReport
            data={categoryList}
            keyTranslation={'titlePieChart'}
            pathTranslation={'delegateRoute'}
            typeData={'delegate'}
            outerRadius={140}
          />
        </div>
        <div className={classes.verticalLine} />
        <div className={classes.pieChartContainer}>
          <StackedBarChartReport
            data={transactionList}
            keyTranslation={'titleBarChart'}
            pathTranslation={'delegateRoute'}
            showLegend={true}
          />
        </div>
      </div>
    </>
  )
}

DelegateDetails.propTypes = {
  categoryList: PropTypes.array,
  transactionList: PropTypes.array
}

export default memo(DelegateDetails)
