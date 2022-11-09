import React, { useState, useEffect, memo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import LanguageSelector from '../LanguageSelector'

import styles from './styles'

const useStyles = makeStyles(styles)

const Header = memo(({ onDrawerToggle }) => {
  const { t } = useTranslation('routes')
  const classes = useStyles()
  const router = useLocation()
  const { pathname: asPath } = router
  const [pathName, setPathName] = useState()

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
