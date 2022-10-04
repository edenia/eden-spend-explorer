import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import { GitMerge as GitMergeIcon } from 'react-feather'

import { mainConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)

const Footer = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.footerInformation}>
        <img
          width="140"
          height="100"
          src={`${process.env.PUBLIC_URL}/images/eoscostarica-logo.png`}
        />
        Copyright ® {new Date().getFullYear()}
        <a href="https://edenia.com/">
          An open source project made with <span>♥</span> by EDENIA
        </a>
      </div>
      <div className={classes.footerInformation}>
        <p>EOS Costa Rica</p>
        <a href="https://es.eoscostarica.io/">Website EOS Costa Rica</a>
        <a href="https://t.me/eoscr">Telegram Channel</a>
        <a href="https://www.linkedin.com/company/eoscostarica">LinkedIn</a>
        <a href="https://github.com/eoscostarica">GitHub</a>
      </div>
      <div className={classes.footerInformation}>
        <p>EDEN</p>
        <a href="https://edeneos.org/">Website Eden On EOS</a>
        <a href="https://genesis.eden.eoscommunity.org/members">
          The Community
        </a>
        <a href="https://www.notion.so/Getting-an-Invite-2d38947d5be94dcb84dfa1ae48894802">
          Get an Invite
        </a>
        <a href="https://github.com/edenia/eden-spend-explorer/tags">
          <GitMergeIcon /> Version {mainConfig.appVersion}
        </a>
      </div>
    </div>
  )
}

export default memo(Footer)
