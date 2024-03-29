import React, { memo, useEffect } from 'react'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Alert, Divider, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import { useTranslation } from 'react-i18next'
import { DelegateItem } from '@edenia/ui-kit'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'
import DelegateDetails from './delegate-details'

const useStyles = makeStyles(styles)

const DelegateAccordion = ({
  accordionList,
  transactionList,
  categoryList,
  setDelegateSelect,
  searchValue,
  electionRoundSelect
}) => {
  const [expanded, setExpanded] = React.useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  const handleChange = (panel, account) => (event, isExpanded) => {
    isExpanded ? setDelegateSelect(account) : setDelegateSelect('')
    setExpanded(isExpanded ? panel : false)
  }

  useEffect(() => {
    setDelegateSelect('')
    setExpanded(false)
  }, [electionRoundSelect])

  return (
    <div className={classes.accordionContainer}>
      {accordionList.length < 1 && searchValue.length > 0 ? (
        <div className={classes.alertAccordionContainer}>
          <Alert severity="error">
            {t('invalidEdenMember', { ns: 'routes' })}
          </Alert>
        </div>
      ) : (
        accordionList.map((delegate, i) => (
          <Accordion
            key={`${delegate.account}-${i}`}
            expanded={expanded === `${delegate.account}-${i}`}
            onChange={handleChange(
              `${delegate.account}-${i}`,
              delegate.account
            )}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className={classes.summaryContentStyle}
            >
              <DelegateItem
                name={delegate.profile.name}
                bgColor="#ffff"
                image={`https://eden-genesis.mypinata.cloud/ipfs/${delegate?.profile?.image}`}
                avatarIcon={delegate?.rank?.badge}
                profileLink={delegate.profile.blog}
                targetProfile="_blank"
                positionText={delegate?.rank?.label}
                headItem={
                  <Typography variant="h6" className="hideData">
                    {formatWithThousandSeparator(delegate?.totalRewarded, 4)}
                  </Typography>
                }
                text={
                  <Typography variant="span" className="hideData">
                    {t('rewarded', { ns: 'delegateRoute' })}
                  </Typography>
                }
              />
            </AccordionSummary>
            <Divider variant="middle" />
            <AccordionDetails>
              <DelegateDetails
                categoryList={categoryList}
                transactionList={transactionList}
              />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  )
}

DelegateAccordion.propTypes = {
  accordionList: PropTypes.array,
  transactionList: PropTypes.array,
  categoryList: PropTypes.array,
  setDelegateSelect: PropTypes.func,
  searchValue: PropTypes.string,
  electionRoundSelect: PropTypes.any
}

export default memo(DelegateAccordion)
