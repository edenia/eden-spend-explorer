import React, { memo, useEffect, useState } from 'react'
import { Sidebar, MenuOption, PreviewProfile } from '@edenia/ui-kit'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { gql, GraphQLClient } from 'graphql-request'
import { Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { useSharedState } from '../../context/state.context'
import { GET_MEMBERS_DATA } from '../../gql'

import styles from './styles'

const useStyles = makeStyles(styles)

const SidebarComp = ({ routes, open, onClose }) => {
  const classes = useStyles()
  const { t } = useTranslation('routes')
  const [state, { logout, showMessage }] = useSharedState()
  const router = useLocation()
  const { pathname } = router
  const [userData, setUSerData] = useState()
  const client = new GraphQLClient('https://eden-api.edenia.cloud/v1/graphql', {
    headers: {}
  })

  useEffect(async () => {
    if (!state?.ual?.activeUser?.accountName) return

    const variables = {
      value: state?.ual?.activeUser?.accountName,
      orderBy: {
        election_rank: 'desc'
      },
      limit: 50
    }
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
  }, [state?.ual?.activeUser])

  return (
    <Sidebar
      open={open}
      close={onClose}
      logo="/logos/eden-spend-explorer-logo.png"
      menuOptions={
        <div className={classes.spacinTopSidebarItems}>
          {routes.map(data => {
            if (!data.component) return <></>

            return (
              <div key={data.name} className={classes.marginTopItemsSidebar}>
                <Link to={data.path} underline="none" component={RouterLink}>
                  <MenuOption
                    text={t(`${data.path}>sidebar`)}
                    icon={data.icon}
                    isSelected={pathname === data.path}
                  />
                </Link>
              </div>
            )
          })}
        </div>
      }
      profileComponent={
        state.ual.activeUser ? (
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
                    href={`https://genesis.eden.eoscommunity.org/${state?.ual?.activeUser?.accountName}`}
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
        ) : undefined
      }
    />
  )
}

SidebarComp.propTypes = {
  routes: PropTypes.array,
  onClose: PropTypes.func,
  open: PropTypes.bool
}

export default memo(SidebarComp)
