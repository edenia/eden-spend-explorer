import React, { memo, useEffect } from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import { Typography, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Footer } from '@edenia/ui-kit'

import styles from './styles'
import { footerItems } from '../../constants'
const useStyles = makeStyles(styles)

const cleanFooterItems = (footerItem, translation) => {
  for (let pos = 0; pos < footerItem.length; pos++) {
    footerItem[pos].links.map(element => {
      return (element.text = translation(element.text, { ns: 'footer' }))
    })
    footerItem[pos].title = translation(footerItem[pos].title, { ns: 'footer' })
  }
  return footerItem
}

const FooterComp = () => {
  const { t, i18n } = useTranslation('footer')
  const classes = useStyles()
  const theme = useTheme()
  let cleanData = cleanFooterItems(footerItems, t)

  console.log({ footerItems })
  useEffect(() => {
    cleanData = cleanFooterItems(footerItems, t)
    console.log({ cleanData })
  }, [i18n.language])

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
              {/* {t('communityOwnedPublic')}&ensp; */}
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
        itemsFooter={cleanData}
      />
    </div>
  )
}

export default memo(FooterComp)
