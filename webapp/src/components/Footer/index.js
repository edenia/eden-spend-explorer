import React, { memo } from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import { Typography, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Footer } from '@edenia/ui-kit'

import styles from './styles'
const useStyles = makeStyles(styles)

const FooterComp = () => {
  const { t } = useTranslation('footer')
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div className={classes.footerRoot}>
      <Footer
        bgColor={'white'}
        buttomContent={
          <div className={classes.footerContainer}>
            <Typography
              variant="inherit"
              color={theme.palette.grey[600]}
              display="flex"
            >
              {t('communityOwnedPublic')}&ensp;
              <Link
                target="_blank"
                href="https://edenia.com"
                rel="noreferrer"
                color={theme.palette.grey[600]}
                className={classes.linkStyle}
              >
                {`${t('developedEdenia')}`}
              </Link>
              &nbsp;
            </Typography>
            <img
              src="https://proxy.eden.eoscommunity.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fedenia-isotipo-grey.b3148c10.png&w=32&q=75"
              alt="edenia logo"
              width="18px"
              height="18px"
            />
          </div>
        }
        itemsFooter={[
          {
            title: t('firstHeader'),
            links: [
              {
                underline: 'none',
                ref: 'https://genesis.eden.eoscommunity.org/members',
                target: '_blank',
                text: t('community')
              },
              {
                underline: 'none',
                ref: 'https://genesis.eden.eoscommunity.org/induction',
                target: '_blank',
                text: t('membership')
              },
              {
                underline: 'none',
                ref: 'https://www.notion.so/Getting-an-Invite-2d38947d5be94dcb84dfa1ae48894802',
                target: '_blank',
                text: t('getInvite')
              }
            ]
          },
          {
            title: t('secondHeader'),
            links: [
              {
                underline: 'none',
                ref: 'https://www.edenelections.com/',
                target: '_blank',
                text: t('electionProcess')
              },
              {
                underline: 'none',
                ref: 'https://github.com/edenia/Eden',
                target: '_blank',
                text: t('github')
              },
              {
                underline: 'none',
                ref: 'https://github.com/edenia/eden-spend-explorer/issues/new/choose',
                target: '_blank',
                text: t('bugFeature')
              }
            ]
          }
        ]}
      />
    </div>
  )
}

export default memo(FooterComp)
