import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { ualConfig } from '../config'
import useLightUAL from '../hooks/useUAL'

const SharedStateContext = React.createContext()

const initialValue = {
  useDarkMode: false,
  user: null,
  eosTrasuryBalance: {},
  elemRef: null
}

const sharedStateReducer = (state, action) => {
  switch (action.type) {
    case 'ual':
      return {
        ...state,
        ual: action.ual
      }

    case 'userChange':
      return {
        ...state,
        user: action.user
      }

    case 'set': {
      return {
        ...state,
        ...action.payload
      }
    }

    case 'showMessage':
      return {
        ...state,
        message: action.payload
      }

    case 'hideMessage':
      return {
        ...state,
        message: null
      }

    case 'logout':
      state.ual.logout()

      return state

    case 'setEosTresuryBalance':
      return {
        ...state,
        eosTrasuryBalance: action.payload
      }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

export const SharedStateProvider = ({ children, ...props }) => {
  const ualState = useLightUAL({
    appName: ualConfig.appName,
    chains: ualConfig.network,
    authenticators: ualConfig.authenticators
  })
  const [state, dispatch] = React.useReducer(sharedStateReducer, {
    ...initialValue
  })
  const value = React.useMemo(() => [state, dispatch], [state])

  useEffect(() => {
    const load = async () => {
      dispatch({ type: 'ual', ual: ualState })

      if (!ualState?.activeUser) return

      dispatch({ type: 'userChange', user: ualState.activeUser })
    }

    load()
  }, [ualState?.activeUser])

  return (
    <SharedStateContext.Provider value={value} {...props}>
      {children}
    </SharedStateContext.Provider>
  )
}

SharedStateProvider.propTypes = {
  children: PropTypes.node,
  ual: PropTypes.any
}

export const useSharedState = () => {
  const context = React.useContext(SharedStateContext)
  const [state, dispatch] = context
  const setState = payload => dispatch({ type: 'set', payload })
  const showMessage = payload => dispatch({ type: 'showMessage', payload })
  const hideMessage = () => dispatch({ type: 'hideMessage' })
  const login = type => {
    state.ual.login(type)
  }
  const logout = () => dispatch({ type: 'logout' })
  const setEOSTrasuryBalance = payload =>
    dispatch({ type: 'setEosTresuryBalance', payload })

  if (!context) {
    throw new Error(`useSharedState must be used within a SharedStateContext`)
  }

  return [
    state,
    {
      setState,
      showMessage,
      hideMessage,
      login,
      logout,
      setEOSTrasuryBalance
    }
  ]
}
