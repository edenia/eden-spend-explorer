import React, { memo, useEffect, useState, useRef } from 'react'
import { Sidebar, MenuOption, PreviewProfile } from '@edenia/ui-kit'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { gql, GraphQLClient } from 'graphql-request'
import { Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Popper from '@mui/material/Popper'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import Grow from '@mui/material/Grow'
import PropTypes from 'prop-types'

import { useSharedState } from '../../context/state.context'
import { GET_MEMBERS_DATA } from '../../gql'
import { mainConfig } from '../../config'
import AuthButton from '../AuthButton'

import styles from './styles'

const useStyles = makeStyles(styles)

const SidebarComp = ({ routes, openComponent, onClose }) => {
  const classes = useStyles()
  const router = useLocation()
  const navigate = useNavigate()
  const anchorRef = useRef(null)
  const { t } = useTranslation('routes')
  const [state, { logout, showMessage }] = useSharedState()
  const [open, setOpen] = useState(false)
  const { pathname } = router
  const [userData, setUSerData] = useState()
  const client = new GraphQLClient(`${mainConfig.urlEndpoint}/v1/graphql`, {
    headers: {}
  })

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleLogout = event => {
    logout()
    handleClose(event)
    window.location.href = '/'
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const prevOpen = useRef(open)

  const handleImageClick = () => {
    navigate('/', {
      replace: true
    })
  }

  useEffect(async () => {
    if (!state?.ual?.activeUser?.accountName) return

    const variables = {
      value: [state?.ual?.activeUser?.accountName],
      orderBy: {
        election_rank: 'desc'
      },
      limit: 50
    }
    try {
      const response = await client.request(
        gql`
          ${GET_MEMBERS_DATA}
        `,
        variables
      )

      if (response?.members.length > 0) setUSerData(response?.members[0])
      else {
        showMessage({
          type: 'warning',
          content: t('invalidEdenMember')
        })
        logout()
      }
    } catch (error) {
      console.log(error)
      showMessage({
        type: 'warning',
        content: t('invalidEdenMember')
      })
      logout()
    }
  }, [state?.ual?.activeUser])

  useEffect(() => {
    if (prevOpen?.current === true && open === false)
      anchorRef?.current?.focus()

    prevOpen.current = open
  }, [open])

  return (
    <div className={classes.sidebar}>
      <Sidebar
        open={openComponent}
        close={onClose}
        logo="/logos/eden-spend-explorer-logo.png"
        onClick={handleImageClick}
        menuOptions={
          <div className={classes.spacinTopSidebarItems}>
            {routes.map(
              data =>
                data.component && (
                  <div
                    key={data.name}
                    className={classes.marginTopItemsSidebar}
                  >
                    <Link
                      to={data.path}
                      underline="none"
                      component={RouterLink}
                    >
                      <MenuOption
                        text={t(`${data.path}>sidebar`)}
                        icon={data.icon}
                        isSelected={pathname === data.path}
                      />
                    </Link>
                  </div>
                )
            )}
          </div>
        }
        profileComponent={
          state?.ual?.activeUser ? (
            <>
              <div
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                aria-hidden="true"
                className={classes.divProfileStyle}
              >
                <PreviewProfile
                  name={userData?.name}
                  nameSize="14px"
                  image={`https://eden-genesis.mypinata.cloud/ipfs/${userData?.profile?.image}`}
                  nameFontWeight="600"
                  selectableItems={
                    <div className={classes.centerSelectableItems}>
                      <Typography variant="caption">
                        <Link
                          color="black"
                          href={`https://genesis.eden.eoscommunity.org/members/${state?.ual?.activeUser?.accountName}`}
                          rel="noreferrer"
                          underline="none"
                          target="_blank"
                        >
                          @ {state?.ual?.activeUser?.accountName}
                        </Link>
                      </Typography>
                    </div>
                  }
                />
              </div>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom-start'
                          ? 'left top'
                          : 'left bottom'
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                        >
                          <MenuItem onClick={handleLogout}>
                            {t('signOut')}
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          ) : (
            <AuthButton btnLabel={t('login')} />
          )
        }
      />
    </div>
  )
}

SidebarComp.propTypes = {
  routes: PropTypes.array,
  onClose: PropTypes.func,
  openComponent: PropTypes.bool
}

export default memo(SidebarComp)
