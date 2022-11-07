import React, { useState, useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import ExitIcon from '@mui/icons-material/ExitToApp'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Button } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import LanguageSelector from '../LanguageSelector'

import { useSharedState } from '../../context/state.context'
import styles from './styles'

const useStyles = makeStyles(styles)

const AuthButton = memo(({ user, onLogin, onSignOut }) => {
  const { t } = useTranslation()

  return (
    <>
      {user && (
        <Button color="secondary" startIcon={<ExitIcon />} onClick={onSignOut}>
          {t('signOut')}
        </Button>
      )}
      {!user && (
        <Button
          color="secondary"
          startIcon={<FingerprintIcon />}
          onClick={onLogin}
        >
          {t('login')}
        </Button>
      )}
    </>
  )
})

AuthButton.displayName = 'AuthButton'

AuthButton.propTypes = {
  user: PropTypes.any,
  onLogin: PropTypes.func,
  onSignOut: PropTypes.func
}

const Header = memo(({ onDrawerToggle }) => {
  const { t } = useTranslation('routes')
  const classes = useStyles()
  const [state, { login, logout }] = useSharedState()
  const router = useLocation()
  const { pathname: asPath } = router
  const [pathName, setPathName] = useState()

  const handleLogin = () => {
    login()
  }

  const handleSignOut = () => {
    logout()
    setPathName('/')
    window.location.href = '/'
  }

  useEffect(() => {
    setPathName(asPath)
  }, [asPath, setPathName])

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={clsx(classes.drawerPaper, classes.topBarStyle)}>
        <div className={classes.menuContainer}>
          <div
            className={clsx(classes.drawerContainer, classes.drawerShowDesktop)}
          >
            <div className={classes.logoAndMenu}>
              <span className={classes.routeLabel}>
                {t(`${pathName}>heading`)}
              </span>
            </div>
            <div className={classes.desktopSection}>
              <AuthButton
                user={state.user}
                onLogin={handleLogin}
                onSignOut={handleSignOut}
              />
              <LanguageSelector />
            </div>
          </div>
          <div
            className={clsx(classes.drawerContainer, classes.drawerShowMobile)}
          >
            <div className={classes.logoAppbar}>
              <IconButton onClick={onDrawerToggle}>
                <MenuIcon fontSize="large" className={classes.menuIconColor} />
              </IconButton>
              <span className={classes.routeLabel}>
                {t(`${pathName}>heading`)}
              </span>
            </div>
            <div className={classes.leftBox}>
              <div className={classes.languageBox}>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
})

Header.displayName = 'Header'

Header.propTypes = {
  onDrawerToggle: PropTypes.func
}

export default Header
