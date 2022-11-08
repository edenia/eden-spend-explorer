import React, { memo } from 'react'
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const Home = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { t } = useTranslation('homeRoute')

  const handleStartButton = () => {
    navigate('income', {
      replace: true
    })
  }

  return (
    <div>
      <div className={classes.titleContainer}>
        <span className={classes.titleStyles}>Eden Spend Explorer</span>
        <div className={classes.subtitleStyles}>
          <span>{t('viewDescription')}</span>
        </div>
        <div className={classes.buttonContainer}>
          <Button type="submit" onClick={handleStartButton}>
            <span className={classes.labelButton}>
              <svg
                style={{ marginRight: '8px' }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.42 19.9999H6.01001V15.59L19.01 2.58997L23.42 6.99994L10.42 19.9999ZM8.01001 17.9999H9.59003L20.59 6.99994L19.01 5.40991L8.01001 16.4099V17.9999Z"
                  fill="#fff"
                />
                <path
                  d="M8.71731 14.2881L7.3031 15.7023L10.3012 18.7004L11.7154 17.2862L8.71731 14.2881Z"
                  fill="#fff"
                />
                <path d="M17 24H0V0H17V4H15V2H2V22H15V17H17V24Z" fill="#fff" />
                <path d="M12 4H4V6H12V4Z" fill="#fff" />
                <path d="M9 8H4V10H9V8Z" fill="#fff" />
                <path d="M6 12H4V14H6V12Z" fill="#fff" />
              </svg>
              {t('button')}
            </span>
          </Button>
        </div>
      </div>
      <div className={classes.boxesContainer}>
        <div className={classes.frameContainer}>
          <div className={classes.titleFrame}>
            <span>EDAS</span>
          </div>
          <div className={classes.bodyFrame}>
            <span>{t('edasDescription')}</span>
          </div>
        </div>
        <div className={classes.frameContainer}>
          <div className={classes.titleFrame}>
            <span>{t('transparent')}</span>
          </div>
          <div className={classes.bodyFrame}>
            <span>{t('transparentDescription')}</span>
          </div>
        </div>
        <div className={classes.frameContainer}>
          <div className={classes.titleFrame}>
            <span>Eden</span>
          </div>
          <div className={classes.bodyFrame}>
            <span>{t('edenDescription')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default memo(Home)
