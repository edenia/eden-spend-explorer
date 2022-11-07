import React, { lazy } from 'react'

import {
  GitMerge as GitMergeIcon,
  GitHub as GitHubIcon,
  Send as TelegramIcon
} from 'react-feather'
// import { HelpOutlineOutlined as HelpIcon } from '@mui/icons-material'

import { mainConfig } from '../config'

const SpendTools = lazy(() => import('./SpendTools'))
const ExpenseReportDelegates = lazy(() => import('./ExpenseReportDelegates'))
const ExpenseReportGeneral = lazy(() => import('./ExpenseReportGeneral'))
const IncomeReportDelegates = lazy(() => import('./IncomeReportDelegates'))
const IncomeReportGeneral = lazy(() => import('./IncomeReportGeneral'))
const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))
// const Help = lazy(() => import('./Help'))
const Page404 = lazy(() => import('./Route404'))

const routes = [
  {
    name: 'Home',
    icon: '/icons/home-icon.svg',
    component: Home,
    path: '/',
    exact: true
  },
  {
    name: 'Income',
    icon: '/icons/income-icon.svg',
    component: IncomeReportGeneral,
    path: '/generalIncomes',
    exact: true
  },
  {
    name: 'Income',
    icon: '/icons/expenses-icon.svg',
    component: IncomeReportDelegates,
    path: '/delegateIncomes',
    exact: true
  },
  {
    name: 'Expenses',
    icon: '/icons/expenses-icon.svg',
    component: ExpenseReportGeneral,
    path: '/generalExpenses',
    exact: true
  },
  {
    name: 'Expenses',
    icon: '/icons/expenses-icon.svg',
    component: ExpenseReportDelegates,
    path: '/delegateExpenses',
    exact: true
  },
  {
    name: 'Spend Tool',
    icon: <img src={`${process.env.PUBLIC_URL}/icons/edit_tool.svg`} />,
    component: SpendTools,
    path: '/spendTools',
    exact: true
  },
  {
    header: 'docs',
    name: 'about',
    icon: '/icons/about-icon.svg',
    component: About,
    path: '/about',
    exact: true
  },
  // {
  //   name: 'help',
  //   icon: <HelpIcon />,
  //   component: Help,
  //   path: '/help',
  //   exact: true
  // },
  {
    name: 'changelog',
    badge: mainConfig.appVersion,
    path: 'https://github.com/edenia/eden-spend-explorer/tags',
    icon: <GitMergeIcon />,
    exact: true
  },
  {
    header: 'community',
    name: 'github',
    path: 'https://github.com/edenia/eden-spend-explorer',
    icon: <GitHubIcon />
  },
  {
    name: 'telegram',
    path: 'https://t.me/eoscr',
    icon: <TelegramIcon />
  },
  {
    component: Page404
  }
]

export default role => {
  const routesForRole = routes.filter(
    route => !route.roles || route.roles.includes(role)
  )

  return {
    sidebar: routesForRole.filter(route => !!route.name),
    browser: routesForRole
      .reduce(
        (routes, route) => [
          ...routes,
          ...(route.childrens ? route.childrens : [route])
        ],
        []
      )
      .filter(route => !!route.component)
  }
}
