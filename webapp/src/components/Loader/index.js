import React from 'react'
import { makeStyles } from '@mui/styles'
import { Spinner } from '@edenia/ui-kit'
import PropTypes from 'prop-types'

import styles from './styles'

const useStyles = makeStyles(styles)

const Loader = ({ size = 56 }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Spinner size={size} />
    </div>
  )
}

Loader.propTypes = {
  size: PropTypes.number
}

export default Loader
