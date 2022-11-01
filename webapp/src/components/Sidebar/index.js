import React, { memo } from 'react'
import { Link } from '@mui/material'
// import { makeStyles, useTheme } from '@mui/styles'
import { Sidebar, MenuOption, PreviewProfile } from '@edenia/ui-kit'
import { useSharedState } from '../../context/state.context'

// import styles from './styles'
// const useStyles = makeStyles(styles)
import { sideBarItems } from '../../constants/sidebar.constants'

const SidebarComp = () => {
  // const classes = useStyles()
  // const theme = useTheme()
  const [state] = useSharedState()

  return (
    <Sidebar
      menuOptions={
        <>
          {sideBarItems.map(data => (
            <div key={data.text} style={{ marginTop: '4px' }}>
              <Link href="google.com" underline="none">
                <MenuOption
                  text={data.text}
                  icon={data.icon}
                  isSelected={data.isSelected}
                />
              </Link>
            </div>
          ))}
        </>
      }
      profileComponent={
        <PreviewProfile
          name={state?.ual?.activeUser?.accountName}
          nameSize="12px"
          nameFontWeight="600"
          // selectableItems={
          //   <div>
          //     <Typography variant="caption">
          //       <Link
          //         href={`https://genesis.eden.eoscommunity.org/`}
          //         rel="noreferrer"
          //         underline="none"
          //         target="_blank"
          //       >
          //         @ {state?.ual?.activeUser?.accountName}
          //       </Link>
          //     </Typography>
          //   </div>
          // }
        />
      }
    />
  )
}

export default memo(SidebarComp)
