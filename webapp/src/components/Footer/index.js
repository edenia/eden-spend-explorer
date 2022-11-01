import React, { memo } from 'react'
import { Typography, Link } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { Footer } from '@edenia/ui-kit'

import styles from './styles'
import { footerItems } from '../../constants'
const useStyles = makeStyles(styles)

const FooterComp = () => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div className={classes.footerRoot}>
      <Footer
        bgColor={'white'}
        buttomContent={
          <div className={classes.footerContainer}>
            <Typography
              variant="caption"
              color={theme.palette.grey[600]}
              display="flex"
            >
              {'footer.communityOwnedPublic'}{' '}
              <Link
                target="_blank"
                href="https://edenia.com"
                rel="noreferrer"
                color={theme.palette.grey[600]}
                className={classes.linkStyle}
              >
                {` ${'footer.developedEdenia'} `}
              </Link>
            </Typography>
          </div>
        }
        itemsFooter={footerItems}
      />
    </div>
  )
}

export default memo(FooterComp)
