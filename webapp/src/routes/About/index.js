import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const About = () => {
  const classes = useStyles()
  const { t } = useTranslation('aboutRoute')

  return (
    <div className={classes.root}>
      <div className={classes.paragraphContainer}>
        <div className={classes.title}>
          <span>{t('subtitle1')}</span>
        </div>
        <div className={classes.paragraph}>
          <span>{t('paragraph1')}</span>
        </div>
      </div>
      <div className={classes.paragraphContainer}>
        <div className={classes.title}>
          <span>{t('subtitle2')}</span>
        </div>
        <div className={classes.paragraph}>
          <span>{t('paragraph2')}</span>
        </div>
      </div>
      <div className={classes.paragraphContainer}>
        <div className={classes.title}>
          <span>{t('subtitle3')}</span>
        </div>
        <div className={classes.paragraph}>
          <span>{t('paragraph3')}</span>
        </div>
      </div>
    </div>
  )
}

export default About
