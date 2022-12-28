import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StylesProvider, createGenerateClassName } from '@mui/styles'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@edenia/ui-kit/dist/index.css'
import { useLazyQuery } from '@apollo/client'
import ReactGA from 'react-ga'

import useTresuryBalanceState from './hooks/customHooks/useTresuryBalanceState'
import routes from './routes'
import Loader from './components/Loader'
import DashboardLayout from './layouts/Dashboard'
import { useSharedState } from './context/state.context'
import getTheme from './theme'
import './i18n'
import { GET_DELEGATES } from '../src/gql/general.gql'

const TRACKING_ID = 'G-3MY19MHQWY'

ReactGA.initialize(TRACKING_ID)

const generateClassName = createGenerateClassName({
  productionPrefix: 'eosSpendExplorer'
})

const App = () => {
  const [state, { setEOSTrasuryBalance }] = useSharedState()
  const [role, setRole] = useState('guest')
  const [{ eosRate, currencyBalance, nextEdenDisbursement }] =
    useTresuryBalanceState()
  const theme = useMemo(() => getTheme(state.useDarkMode), [state.useDarkMode])

  const [loadDelegates, { data: isDelegate }] = useLazyQuery(GET_DELEGATES, {
    variables: {
      delegate: state?.user?.accountName ? state?.user?.accountName : ''
    }
  })

  const userRoutes = useMemo(() => routes(role), [state?.user])

  const renderRoute = ({ component: Component, ...route }, index) => (
    <Route
      key={`path-${route.path}-${index}`}
      path={route.path}
      exact={route.exact}
      element={<Component />}
    />
  )

  useEffect(() => {
    loadDelegates()
  }, [])

  useEffect(() => {
    isDelegate?.eden_delegates.length > 0 ? setRole('member') : setRole('guest')
  }, [isDelegate])

  useEffect(() => {
    setEOSTrasuryBalance({
      eosRate,
      currencyBalance,
      nextEdenDisbursement
    })
  }, [eosRate, currencyBalance, nextEdenDisbursement])

  return (
    <BrowserRouter>
      <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DashboardLayout routes={userRoutes.sidebar}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  {userRoutes.browser.map(renderRoute)}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </DashboardLayout>
          </LocalizationProvider>
        </ThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  )
}

export default App
