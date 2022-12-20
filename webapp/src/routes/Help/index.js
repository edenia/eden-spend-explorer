import React from 'react'
import { makeStyles } from '@mui/styles'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation, Trans } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const Help = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel, account) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const { t, i18n } = useTranslation()

  return (
    <div className={classes.root}>
      <span className={classes.text}>{t('subtitle', { ns: 'helpRoute' })}</span>
      <Accordion
        expanded={expanded === 'panel'}
        onChange={handleChange('panel')}
      >
        <AccordionSummary
          aria-controls="user-roles-access"
          id="user-roles-access"
          expandIcon={<ExpandMoreIcon />}
        >
          <span className={classes.title}>
            {t('userRole', { ns: 'helpRoute' })}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          <span className={classes.text}>
            {t('userRoleText', { ns: 'helpRoute' })}
          </span>
          <img
            src={
              i18n.language === 'es'
                ? '/images/role-access-ES.webp'
                : '/images/role-access-EN.webp'
            }
            width={720}
            height={268}
            className={classes.images}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          aria-controls="understand-data"
          id="understand-data"
          expandIcon={<ExpandMoreIcon />}
        >
          <span className={classes.title}>
            {t('chartData', { ns: 'helpRoute' })}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          <Trans>
            <span className={classes.text}>
              {t('balanceTitle', { ns: 'helpRoute' })}
            </span>
          </Trans>
          <img
            src={
              i18n.language === 'es'
                ? '/images/balance-ES.webp'
                : '/images/balance-EN.webp'
            }
            width={366}
            height={136}
            className={classes.imgBalance}
          />
          <span className={classes.text}>
            {t('balanceText', { ns: 'helpRoute' })}
          </span>
          <div className={classes.horizontalLine} />
          <Trans>
            <span className={classes.text}>
              {t('chartsTitle', { ns: 'helpRoute' })}
            </span>
          </Trans>
          <div className={classes.imagesContainer}>
            <img
              src={
                i18n.language === 'es'
                  ? '/images/charts-ES.webp'
                  : '/images/charts-EN.webp'
              }
              width={1100}
              height={396}
              className={classes.images}
            />
          </div>
          <Trans>
            <span className={classes.text}>
              {t('barChartText', { ns: 'helpRoute' })}
            </span>
            <span className={classes.text}>
              {t('pieChartText', { ns: 'helpRoute' })}
            </span>
          </Trans>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          aria-controls="spend-tools"
          id="spend-tools"
          expandIcon={<ExpandMoreIcon />}
        >
          <span className={classes.title}>
            {t('spendTools', { ns: 'helpRoute' })}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          <span className={classes.text}>
            {t('spendSubTitle', { ns: 'helpRoute' })}
          </span>
          <img
            src={
              i18n.language === 'es'
                ? '/images/spend-tools-ES.webp'
                : '/images/spend-tools-ES.webp'
            }
            width={720}
            height={311}
            className={classes.imgBalance}
          />
          <Trans>
            <span className={classes.text}>
              {t('spendSteps', { ns: 'helpRoute' })}
            </span>
          </Trans>
          <div className={classes.horizontalLine} />
          <Trans>
            <span className={classes.text}>
              {t('spendSubTitle2', { ns: 'helpRoute' })}
            </span>
            <span className={classes.text}>
              {t('spendText', { ns: 'helpRoute' })}
            </span>
          </Trans>
          <img
            src={
              i18n.language === 'es'
                ? '/images/spend-tools2-ES.webp'
                : '/images/spend-tools2-ES.webp'
            }
            width={469}
            height={341}
            className={classes.imgBalance}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Help
