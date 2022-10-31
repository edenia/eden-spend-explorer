import React, { memo } from 'react'
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const Home = () => {
  const classes = useStyles()
  const { t } = useTranslation('homeRoute')

  return (
    <div style={{ border: '1px solid' }}>
      <div
        style={{
          height: '316px',
          border: '1px solid red',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          margin: '16px'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: '-0.6px',
              color: '#000',
              border: '1px solid blue',
              marginTop: '16px'
            }}
          >
            Eden Expend Explorer
          </span>
        </div>
        <div
          style={{
            marginTop: '16px',
            border: '1px solid blue',
            maxWidth: '450px',
            textAlign: 'center',
            letterSpacing: '0.15px',
            color: '#000'
          }}
        >
          <span>{t('viewDescription')}</span>
        </div>
        <div
          style={{ border: '1px solid blue', marginTop: '16px' }}
          className={classes.buttonContainer}
        >
          <Button type="submit">
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
      <div
        style={{
          border: '1px solid green',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{ border: '1px solid yellow', width: '323px', margin: '16px' }}
        >
          <div
            style={{
              fontWeight: 500,
              fontSize: '18px',
              color: '#000',
              lineHeight: 1.56,
              letterSpacing: '-0.4px'
            }}
          >
            <span>EDAS</span>
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#667080',
              lineHeight: 1.56,
              letterSpacing: '-0.4px'
            }}
          >
            <span>{t('edasDescription')}</span>
          </div>
        </div>
        <div
          style={{ border: '1px solid yellow', width: '323px', margin: '16px' }}
        >
          <div
            style={{
              fontWeight: 500,
              fontSize: '18px',
              color: '#000',
              lineHeight: 1.56,
              letterSpacing: '-0.4px'
            }}
          >
            <span>{t('transparent')}</span>
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#667080',
              lineHeight: 1.56,
              letterSpacing: '-0.4px'
            }}
          >
            <span>{t('transparentDescription')}</span>
          </div>
        </div>
        <div
          style={{ border: '1px solid yellow', width: '323px', margin: '16px' }}
        >
          <div
            style={{
              fontWeight: 500,
              fontSize: '18px',
              color: '#000',
              lineHeight: 1.56,
              letterSpacing: '-0.4px'
            }}
          >
            <span>Eden</span>
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#667080',
              lineHeight: 1.56,
              letterSpacing: '-0.4px'
            }}
          >
            <span>{t('edenDescription')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default memo(Home)
