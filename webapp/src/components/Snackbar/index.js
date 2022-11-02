import React, { memo } from 'react'
import { Button, Snackbar } from '@mui/material'
import PropTypes from 'prop-types'

const SnackbarComponent = ({
  open,
  setOpen,
  message,
  buttonMessage,
  duration = 6000
}) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      action={
        <Button color="warning" size="small" onClick={handleClose}>
          {buttonMessage}
        </Button>
      }
    ></Snackbar>
  )
}

SnackbarComponent.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  message: PropTypes.string,
  buttonMessage: PropTypes.string,
  duration: PropTypes.number
}

export default memo(SnackbarComponent)
