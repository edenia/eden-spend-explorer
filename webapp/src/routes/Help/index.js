import React from 'react'
import { makeStyles } from '@mui/styles'
import { Divider } from '@mui/material'
// import { useTranslation } from 'react-i18next'
// import Grid from '@mui/material/Grid'
// import Box from '@mui/material/Box'
// import Link from '@mui/material/Link'
// import HttpIcon from '@mui/icons-material/Http'
// import TelegramIcon from '@mui/icons-material/Telegram'
// import GitHubIcon from '@mui/icons-material/GitHub'

import BarChartReport from '../../components/BarChartReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import PieChartReport from '../../components/PieChartReport'

import styles from './styles'

const useStyles = makeStyles(styles)

const elections = [
  {
    EOS_CLAIMED: 58341.7245,
    EOS_TOTAL: 60052.871499999994,
    EOS_UNCLAIMED: 1711.147,
    USD_CLAIMED: 194728.16963929398,
    USD_TOTAL: 200083.1695493529,
    USD_UNCLAIMED: 5354.999910058913,
    date: '2022-3-09T00:00:00+00:00',
    election: 'Election 1'
  },
  {
    EOS_CLAIMED: 58341.7245,
    EOS_TOTAL: 60052.871499999994,
    EOS_UNCLAIMED: 1711.147,
    USD_CLAIMED: 194728.16963929398,
    USD_TOTAL: 200083.1695493529,
    USD_UNCLAIMED: 5354.999910058913,
    date: '2022-6-09T00:00:00+00:00',
    election: 'Election 2'
  },
  {
    EOS_CLAIMED: 58341.7245,
    EOS_TOTAL: 60052.871499999994,
    EOS_UNCLAIMED: 1711.147,
    USD_CLAIMED: 194728.16963929398,
    USD_TOTAL: 200083.1695493529,
    USD_UNCLAIMED: 5354.999910058913,
    date: '2022-9-09T00:00:00+00:00',
    election: 'Election 3'
  },
  {
    EOS_CLAIMED: 58341.7245,
    EOS_TOTAL: 60052.871499999994,
    EOS_UNCLAIMED: 1711.147,
    USD_CLAIMED: 194728.16963929398,
    USD_TOTAL: 200083.1695493529,
    USD_UNCLAIMED: 5354.999910058913,
    date: '2022-12-09T00:00:00+00:00',
    election: 'Election 4'
  }
]

const delegates = [
  {
    EOS_CLAIMED: 1423.3212,
    EOS_UNCLAIMED: 16.4532,
    USD_CLAIMED: 1818.9734950042096,
    USD_UNCLAIMED: 19.013074101430814,
    color: '#1f78b4',
    name: 'delegate-1'
  },
  {
    EOS_CLAIMED: 1423.3212,
    EOS_UNCLAIMED: 16.4532,
    USD_CLAIMED: 1818.9734950042096,
    USD_UNCLAIMED: 19.013074101430814,
    color: '#b2df8a',
    name: 'delegate-2'
  },
  {
    EOS_CLAIMED: 1423.3212,
    EOS_UNCLAIMED: 16.4532,
    USD_CLAIMED: 1818.9734950042096,
    USD_UNCLAIMED: 19.013074101430814,
    color: '#33a02c',
    name: 'delegate-3'
  },
  {
    EOS_CLAIMED: 1423.3212,
    EOS_UNCLAIMED: 16.4532,
    USD_CLAIMED: 1818.9734950042096,
    USD_UNCLAIMED: 19.013074101430814,
    color: '#fb9a99',
    name: 'delegate-4'
  },
  {
    EOS_CLAIMED: 1423.3212,
    EOS_UNCLAIMED: 16.4532,
    USD_CLAIMED: 1818.9734950042096,
    USD_UNCLAIMED: 19.013074101430814,
    color: '#e31a1c',
    name: 'delegate-5'
  },
  {
    EOS_CLAIMED: 1423.3212,
    EOS_UNCLAIMED: 16.4532,
    USD_CLAIMED: 1818.9734950042096,
    USD_UNCLAIMED: 19.013074101430814,
    color: '#fdbf6f',
    name: 'delegate-6'
  }
]

const Help = () => {
  const classes = useStyles()
  // const { t } = useTranslation('helpRoute')

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
      </div>
      <BarChartReport
        data={elections}
        keyTranslation={'titleBarChart'}
        pathTranslation={'incomeRoute'}
        showLegend={true}
        typeData={'income'}
      />
      <Divider variant="middle" />

      <PieChartReport
        data={delegates}
        keyTranslation={'titlePieChart'}
        pathTranslation={'incomeRoute'}
        typeData={'income'}
      />
    </div>
  )
}

export default Help
