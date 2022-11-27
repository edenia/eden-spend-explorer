import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Accordion from '@mui/material/Accordion'
import { makeStyles } from '@mui/styles'
import AccordionDetails from '@mui/material/AccordionDetails'
// import { Typography } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DelegateItem } from '@edenia/ui-kit'
// import { useTranslation } from 'react-i18next'

import useDelegateReportState from '../../hooks/customHooks/useDelegateReportState'
// import { formatWithThousandSeparator } from '../../utils'
import DelegateDetails from '../DelegateDetails'
import styles from './styles'

const useStyles = makeStyles(styles)

const AccordionComp = ({
  nameDelegate,
  accountDelegate,
  imageDelegate,
  avatarIcon,
  profileLink,
  delegateLevel,
  eosRewarded
}) => {
  const [expanded, setExpanded] = React.useState(false)
  const classes = useStyles()
  // const { t } = useTranslation()
  const [{ transactionList, categoryList }, { setDelegateSelect }] =
    useDelegateReportState()

  const handleChange = panel => (event, isExpanded) => {
    isExpanded && setDelegateSelect(accountDelegate)
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className={classes.summaryContentStyle}
        >
          <DelegateItem
            name={nameDelegate}
            bgColor="#ffff"
            image={`https://eden-genesis.mypinata.cloud/ipfs/${imageDelegate}`}
            avatarIcon={avatarIcon}
            profileLink={profileLink}
            targetProfile="_blank"
            positionText={delegateLevel}
            // headItem={
            //   <Typography variant="h6">
            //     {formatWithThousandSeparator(eosRewarded)}
            //   </Typography>
            // }
            // text={t('rewarded', { ns: 'delegateRoute' })}
          />
        </AccordionSummary>
        <AccordionDetails>
          <DelegateDetails
            categoryList={categoryList}
            transactionList={transactionList}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

AccordionComp.propTypes = {
  nameDelegate: PropTypes.string,
  accountDelegate: PropTypes.string,
  imageDelegate: PropTypes.string,
  avatarIcon: PropTypes.string,
  profileLink: PropTypes.string,
  delegateLevel: PropTypes.string,
  eosRewarded: PropTypes.number
}

export default memo(AccordionComp)
