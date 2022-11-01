import React, { useState, useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import AccountIcon from '@mui/icons-material/AccountCircle'
import ExitIcon from '@mui/icons-material/ExitToApp'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Button } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import { makeStyles } from '@mui/styles'
import { Sun as SunIcon, Moon as MoonIcon } from 'react-feather'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import LanguageSelector from '../LanguageSelector'

import { useSharedState } from '../../context/state.context'
import styles from './styles'

const useStyles = makeStyles(styles)

const SwitchThemeModeButton = memo(({ useDarkMode, onSwitch }) => {
  const { t } = useTranslation('header')

  return (
    <Button
      color="secondary"
      startIcon={useDarkMode ? <SunIcon /> : <MoonIcon />}
      onClick={() => onSwitch(!useDarkMode)}
    >
      {t(useDarkMode ? 'lightMode' : 'darkMode')}
    </Button>
  )
})

SwitchThemeModeButton.displayName = 'SwitchThemeModeButton'

SwitchThemeModeButton.propTypes = {
  useDarkMode: PropTypes.bool,
  onSwitch: PropTypes.func
}

const UserButton = memo(({ user }) => (
  <>
    {user && (
      <Button color="secondary" startIcon={<AccountIcon />}>
        {user.accountName}
      </Button>
    )}
  </>
))

UserButton.displayName = 'UserButton'

UserButton.propTypes = {
  user: PropTypes.any
}

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
  const { t } = useTranslation()
  const classes = useStyles()
  const [state, { setState, login, logout }] = useSharedState()
  const router = useLocation()
  const { pathname: asPath } = router
  const [pathName, setPathName] = useState()

  const handleSwitchThemeMode = useDarkMode => {
    setState({ useDarkMode })
  }

  const handleLogin = () => {
    login()
  }

  const handleSignOut = () => {
    logout()
    setPathName('/')
  }

  useEffect(() => {
    setPathName(asPath.replace('/', ''))
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
                {t(`routes.${pathName}`)}
              </span>
            </div>
            <div className={classes.desktopSection}>
              <SwitchThemeModeButton
                useDarkMode={state.useDarkMode}
                onSwitch={handleSwitchThemeMode}
              />
              <UserButton user={state.user} />
              <AuthButton
                user={state.user}
                onLogin={handleLogin}
                onSignOut={handleSignOut}
              />
              <LanguageSelector />
            </div>
            {/* <div className={classes.languageBox}>
              <div className={classes.paddingLenguajeSelector}></div>
            </div> */}
          </div>
          <div
            className={clsx(classes.drawerContainer, classes.drawerShowMobile)}
          >
            <div className={classes.logoAppbar}>
              <IconButton onClick={onDrawerToggle}>
                <MenuIcon fontSize="large" className={classes.menuIconColor} />
              </IconButton>
              <span className={classes.routeLabel}>
                {t(`routes.${pathName}`)}
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
