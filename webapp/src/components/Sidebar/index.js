import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import MuiListItem from '@mui/material/ListItem'
import {
  Box,
  Drawer,
  Chip,
  List,
  Typography,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar
} from '@mui/material'
import {
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon
} from 'react-feather'
import Scrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

import styles from './styles'

const useStyles = makeStyles(styles)

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink ref={ref} {...props} />
))

NavLink.displayName = 'NavLink'

const ExternalLink = React.forwardRef(({ to, children, className }, ref) => (
  <a
    ref={ref}
    href={to}
    className={className}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
))

ExternalLink.displayName = 'NavLink'

ExternalLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
}

const ListItemLink = ({ name, path, icon, badge, ...props }) => {
  const { t } = useTranslation('routes')
  const classes = useStyles()
  const primaryText = path.includes('http')
    ? t(name, name)
    : t(`${path}>sidebar`, path)

  return (
    <MuiListItem
      button
      component={path.includes('http') ? ExternalLink : NavLink}
      to={path}
      activeclassname="active"
      href={path}
      {...props}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={primaryText} />
      {badge && <Chip className={classes.badge} label={badge} />}
    </MuiListItem>
  )
}

ListItemLink.propTypes = {
  name: PropTypes.string,
  path: PropTypes.string,
  icon: PropTypes.node,
  badge: PropTypes.string
}

const ListItemGroup = ({ name, icon, path, childrens, ...props }) => {
  const [open, setOpen] = useState(true)
  const { t } = useTranslation('routes')

  return (
    <>
      <MuiListItem button onClick={() => setOpen(() => !open)} {...props}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={t(name)} />
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </MuiListItem>
      {childrens && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {childrens.map((route, index) => (
            <ListItem
              header={route.header}
              path={route.path}
              icon={route.icon}
              text={route.text}
              key={`${route.name}${index}`}
            />
          ))}
        </Collapse>
      )}
    </>
  )
}

ListItemGroup.propTypes = {
  name: PropTypes.string,
  path: PropTypes.string,
  icon: PropTypes.node,
  childrens: PropTypes.array
}

const ListItem = ({ header, childrens, ...props }) => {
  const { t } = useTranslation('routes')
  const classes = useStyles()

  return (
    <Box className={classes.listItem}>
      {header && <Typography>{t(header)}</Typography>}
      {childrens && <ListItemGroup childrens={childrens} {...props} />}
      {!childrens && <ListItemLink {...props} />}
    </Box>
  )
}

ListItem.propTypes = {
  header: PropTypes.string,
  childrens: PropTypes.array
}

const Sidebar = ({ routes, ...props }) => {
  const navigate = useNavigate()
  const classes = useStyles()

  return (
    <Drawer className={classes.main} {...props}>
      <Toolbar />
      <Box className={classes.brand}>
        <Box display="flex" flexDirection="column" textAlign="center">
          <AccountCircleIcon
            onClick={() => navigate('/')}
            sx={{ color: '#00c2bf', fontSize: '80px' }}
          />
          <Typography>USER</Typography>
        </Box>
      </Box>

      <Scrollbar className={classes.scrollbar}>
        <Box width="235px" height="2px" bgcolor="#00c2bf" margin="auto" />
        <List component="nav">
          {routes.map((category, index) => (
            <ListItem
              key={`${category.name}${index}`}
              name={category.name}
              header={category.header}
              path={category.path}
              icon={category.icon}
              badge={category.badge}
              childrens={category.childrens}
            />
          ))}
        </List>
      </Scrollbar>
    </Drawer>
  )
}

Sidebar.propTypes = {
  routes: PropTypes.array
}

export default memo(Sidebar)
