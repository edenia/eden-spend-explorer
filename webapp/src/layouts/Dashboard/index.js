import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hidden from '@mui/material/Hidden'
import { makeStyles } from '@mui/styles'
import { Toolbar } from '@mui/material'
import PropTypes from 'prop-types'
import ReactGA from 'react-ga'

import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Message from '../../components/Message'
import FooterComp from '../../components/Footer'

import styles from './styles'

const drawerWidth = 220
const useStyles = makeStyles(theme => styles(theme, drawerWidth))

const Dashboard = ({ children, routes }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const classes = useStyles()
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })

    ReactGA.pageview(window.location.pathname)
  }, [pathname])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className={classes.root}>
      <div className={classes.drawer}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <Hidden mdUp implementation="js">
          <Sidebar
            PaperProps={{
              style: { width: drawerWidth }
            }}
            variant="temporary"
            openComponent={mobileOpen}
            onClose={handleDrawerToggle}
            routes={routes}
          />
        </Hidden>
        <Hidden mdDown implementation="css">
          <Sidebar
            PaperProps={{
              style: { width: drawerWidth }
            }}
            variant="permanent"
            routes={routes}
          />
        </Hidden>
      </div>
      <div className={classes.mainContent}>
        <Toolbar />
        <div className={classes.childContent}>{children}</div>
        <Message />
        <FooterComp />
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
  routes: PropTypes.array
}

export default Dashboard
