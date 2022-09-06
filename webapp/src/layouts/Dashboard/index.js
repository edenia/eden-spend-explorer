import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Hidden from '@mui/material/Hidden'
import { makeStyles } from '@mui/styles'

import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Message from '../../components/Message'
import Footer from '../../components/Footer'

import styles from './styles'
import { Toolbar } from '@mui/material'

const drawerWidth = 260
const useStyles = makeStyles(theme => styles(theme, drawerWidth))

const Dashboard = ({ children, routes }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const classes = useStyles()

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
            open={mobileOpen}
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
        <Footer />
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
  routes: PropTypes.array
}

export default Dashboard
