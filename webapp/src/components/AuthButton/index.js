import React, { useState, useEffect } from 'react'
import { Button, Spinner } from '@edenia/ui-kit'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { useSharedState } from '../../context/state.context'

import useStyles from './styles'

const AuthButton = ({ btnLabel }) => {
  const [state, { login }] = useSharedState()
  const [loader, setLoader] = useState(false)
  const { t } = useTranslation()
  const classes = useStyles()

  const handleLogin = async () => {
    setLoader(true)
    login('anchor')
  }

  useEffect(() => {
    if (state?.validUser === undefined || state?.validUser) return

    setLoader(false)
  }, [state?.validUser, t])

  return (
    <div className={classes.loginBtn}>
      {!state?.ual?.activeUser && (
        <Button onClick={handleLogin} label={btnLabel} variant="primary" />
      )}
      <p />
      {loader && <Spinner />}
    </div>
  )
}

AuthButton.propTypes = {
  btnLabel: PropTypes.string
}

export default AuthButton
