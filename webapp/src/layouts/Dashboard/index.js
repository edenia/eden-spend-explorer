import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Hidden from '@mui/material/Hidden'
import Box from '@mui/material/Box'
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
    <Box height="100%">
      <Box className={classes.root}>
        <Box className={classes.drawer}>
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
                style: { width: drawerWidth, height: 'calc(100vh - 64px)' }
              }}
              variant="permanent"
              routes={routes}
            />
          </Hidden>
        </Box>
        <Box className={classes.mainContent}>
          <Toolbar />
          <Box className={classes.childContent}>{children}</Box>
          <Message />
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
  routes: PropTypes.array
}

export default Dashboard
