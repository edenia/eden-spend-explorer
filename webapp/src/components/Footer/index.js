import React, { memo } from 'react'
import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { GitMerge as GitMergeIcon } from 'react-feather'

import { mainConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const Footer = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box className={classes.footerInformation}>
            <img
              width="140"
              height="100"
              src="https://guias.eoscostarica.io/assets/images/eoscostarica-logo-790106817dcb2928ca190a0723d48662.png"
            />
            Copyright ® {new Date().getFullYear()}
            <a href="https://edenia.com/">
              An open source project made with <span>♥</span> by EDENIA
            </a>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box className={classes.footerInformation}>
            EOS Costa Rica
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              mt={2}
            >
              <a href="https://edeneos.org/">Website EOS Costa Rica</a>
              <a href="https://t.me/eoscr">Telegram Channel</a>
              <a href="https://www.linkedin.com/company/eoscostarica/mycompany/">
                Linkedin
              </a>
              <a href="https://github.com/eoscostarica">GitHub</a>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box className={classes.footerInformation}>
            EDEN
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              mt={2}
            >
              <a href="https://edeneos.org/">Website Eden On EOS</a>
              <a href="https://genesis.eden.eoscommunity.org/members">
                The Community
              </a>
              <a href="https://www.notion.so/Getting-an-Invite-2d38947d5be94dcb84dfa1ae48894802">
                Get an Invite
              </a>
              <a href="https://github.com/eoscostarica/eden-accounting-standard/tags">
                <Box display="flex">
                  <GitMergeIcon /> Version {mainConfig.appVersion}
                </Box>
              </a>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default memo(Footer)
