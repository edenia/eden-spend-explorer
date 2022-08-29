import React, { memo } from 'react'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const Footer = () => {
  const classes = useStyles()

  return (
    <Box borderTop={1} borderColor="#DEE3E3" className={classes.root}>
      Probando ando
    </Box>
  )
}

export default memo(Footer)
