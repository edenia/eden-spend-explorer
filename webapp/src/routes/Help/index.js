import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation, Trans } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const Help = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const { t, i18n } = useTranslation()

  return (
    <div className={classes.root}>
      <span className={classes.subTitle}>
        {t('subtitle', { ns: 'helpRoute' })}
      </span>
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
          <span className={classes.subTitle}>
            {t('userRoleText', { ns: 'helpRoute' })}
          </span>
          <div className={classes.imagesContainer}>
            <img
              src={
                i18n.language === 'es'
                  ? '/images/role-access-ES.webp'
                  : '/images/role-access-EN.webp'
              }
            />
          </div>
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
            <span className={classes.subTitle}>
              {t('balanceTitle', { ns: 'helpRoute' })}
            </span>
          </Trans>
          <div className={classes.imagesContainer}>
            <img
              id="balance"
              src={
                i18n.language === 'es'
                  ? '/images/balance-ES.webp'
                  : '/images/balance-EN.webp'
              }
            />
          </div>
          <div className={classes.paragraph}>
            <span className={classes.text}>
              {t('balanceText1', { ns: 'helpRoute' })}
            </span>
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noreferrer"
              title="coingecko.com"
            >
              coingecko.com
            </a>
            <span className={classes.text}>
              {t('balanceText2', { ns: 'helpRoute' })}
            </span>
          </div>
          <Divider orientation="horizontal" variant="middle" />
          <Trans>
            <span className={classes.subTitle}>
              {t('treasuryTitle', { ns: 'helpRoute' })}
            </span>
          </Trans>
          <div className={classes.imagesContainer}>
            <img
              src={
                i18n.language === 'es'
                  ? '/images/treasury-chart-ES.webp'
                  : '/images/treasury-chart-EN.webp'
              }
            />
          </div>
          <div className={classes.paragraph}>
            <Trans>
              <span className={classes.text}>
                {t('lineChartText1', { ns: 'helpRoute' })}
              </span>
              <span className={classes.text}>
                {t('lineChartText2', { ns: 'helpRoute' })}
              </span>
              <span className={classes.text}>
                {t('lineChartText3', { ns: 'helpRoute' })}
              </span>
            </Trans>
          </div>
          <Divider orientation="horizontal" variant="middle" />
          <Trans>
            <span className={classes.subTitle}>
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
            />
          </div>
          <div className={classes.paragraph}>
            <Trans>
              <span className={classes.text}>
                {t('barChartText', { ns: 'helpRoute' })}
              </span>
            </Trans>
            <Trans>
              <span className={classes.text}>
                {t('pieChartText1', { ns: 'helpRoute' })}
              </span>
              <a
                href="https://bloks.io/account/genesis.eden"
                target="_blank"
                rel="noreferrer"
                title="Genesis.eden"
              >
                Genesis.eden
              </a>
              <span className={classes.text}>
                {t('pieChartText2', { ns: 'helpRoute' })}
              </span>
            </Trans>
          </div>
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
          <span className={classes.subTitle}>
            {t('spendSubTitle', { ns: 'helpRoute' })}
          </span>
          <div className={classes.imagesContainer}>
            <img
              id="spendTool"
              src={
                i18n.language === 'es'
                  ? '/images/spend-tools-ES.webp'
                  : '/images/spend-tools-EN.webp'
              }
            />
          </div>
          <div className={classes.paragraph}>
            <Trans>
              <span className={classes.text}>
                {t('spendSteps1', { ns: 'helpRoute' })}
              </span>
              <a
                href="https://greymass.com/en/anchor/"
                target="_blank"
                rel="noreferrer"
                title="Anchor"
              >
                Anchor
              </a>
              <span className={classes.text}>
                {t('spendSteps2', { ns: 'helpRoute' })}
              </span>
            </Trans>
            <Divider orientation="horizontal" variant="middle" />
            <Trans>
              <span className={classes.subTitle}>
                {t('spendSubTitle2', { ns: 'helpRoute' })}
              </span>
              <div className={classes.paragraph}>
                <span className={classes.text}>
                  {t('spendText', { ns: 'helpRoute' })}
                </span>
              </div>
            </Trans>
          </div>
          <div className={classes.imagesContainer}>
            <img
              id="categorizedSpend"
              src={
                i18n.language === 'es'
                  ? '/images/spend-tools2-ES.webp'
                  : '/images/spend-tools2-EN.webp'
              }
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Help
