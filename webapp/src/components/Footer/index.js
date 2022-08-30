import React, { memo } from 'react'
import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const Footer = () => {
  const classes = useStyles()

  return (
    <Box borderTop={1} className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box className={classes.edenInformation}>
            <a href="https://edeneos.org/">Genesis Eden Community</a>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box display="flex" justifyContent="end">
            <Box className={classes.creatorInformation}>
              <a href="https://edenia.com/">
                An open source project made with <span>♥</span> by Edenia
              </a>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default memo(Footer)
