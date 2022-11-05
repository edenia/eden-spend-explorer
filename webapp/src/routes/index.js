import React, { lazy } from 'react'

import {
  GitMerge as GitMergeIcon,
  GitHub as GitHubIcon,
  Send as TelegramIcon
} from 'react-feather'
import {
  AddCard as AddCardIcon,
  AttachMoney as AttachMoneyIcon,
  Home as HomeIcon,
  InfoOutlined as InfoIcon,
  HelpOutlineOutlined as HelpIcon,
  PersonOutline as PersonOutlineIcon
} from '@mui/icons-material'

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
    name: 'home',
    icon: <HomeIcon />,
    component: Home,
    path: '/',
    exact: true
  },
  {
    name: 'Income',
    icon: <AddCardIcon />,
    component: IncomeReport,
    path: '/income',
    exact: true
  },
  {
    name: 'Expense',
    icon: <AttachMoneyIcon />,
    component: ExpenseReport,
    path: '/expense',
    exact: true
  },
  {
    name: 'Delegate',
    icon: <PersonOutlineIcon />,
    component: DelegateReport,
    path: '/delegate',
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
    icon: <InfoIcon />,
    component: About,
    path: '/about',
    exact: true
  },
  {
    name: 'help',
    icon: <HelpIcon />,
    component: Help,
    path: '/help',
    exact: true
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
