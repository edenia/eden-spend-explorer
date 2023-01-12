import React, { lazy } from 'react'

import {
  GitMerge as GitMergeIcon,
  GitHub as GitHubIcon,
  Send as TelegramIcon
} from 'react-feather'

import { mainConfig } from '../config'

const SpendTools = lazy(() => import('./SpendTools'))
const DelegateReport = lazy(() => import('./DelegateReport'))
const ExpenseReport = lazy(() => import('./ExpenseReport'))
const IncomeReport = lazy(() => import('./IncomeReport'))
const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))
const Help = lazy(() => import('./Help'))
const Page404 = lazy(() => import('./Route404'))

const routes = [
  {
    name: 'Home',
    icon: '/icons/home-icon.svg',
    component: Home,
    path: '/',
    exact: true,
    roles: ['guest', 'member']
  },
  {
    name: 'Income',
    icon: '/icons/income-icon.svg',
    component: IncomeReport,
    path: '/income',
    exact: true,
    roles: ['guest', 'member']
  },
  {
    name: 'Expenses',
    icon: '/icons/expenses-icon.svg',
    component: ExpenseReport,
    path: '/expense',
    exact: true,
    roles: ['guest', 'member']
  },
  {
    name: 'Delegate',
    icon: '/icons/delegate-icon.svg',
    component: DelegateReport,
    path: '/delegate',
    exact: true,
    roles: ['guest', 'member']
  },
  {
    name: 'Spend Tool',
    icon: '/icons/tools-icon.svg',
    component: SpendTools,
    path: '/spendTools',
    exact: true,
    roles: ['member']
  },
  {
    name: 'about',
    icon: '/icons/about-icon.svg',
    component: About,
    path: '/about',
    exact: true,
    roles: ['guest', 'member']
  },
  {
    name: 'help',
    icon: '/icons/help-icon.svg',
    component: Help,
    path: '/help',
    exact: true,
    roles: ['guest', 'member']
  },
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
  const routesForRole = routes.filter(route => route?.roles?.includes(role))

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
