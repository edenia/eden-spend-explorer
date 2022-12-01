import React, { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import { useTranslation } from 'react-i18next'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const LanguageSelector = () => {
  const { t } = useTranslation()
  const { i18n } = useTranslation('translations')
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState()
  const anchorRef = useRef(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleChangeLanguage = language => i18n.changeLanguage(language)

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  useEffect(() => {
    setCurrentLanguage(i18n.language?.substring(0, 2) || 'en')
  }, [i18n.language])

  return (
    <div>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <div className={classes.paddingIcon}>
          <img
            src={`${process.env.PUBLIC_URL}/images/language-icon.png`}
            alt="icon-language"
            width="24px"
            height="24px"
          />
        </div>
        <Typography variant="body1" className={classes.languageLabel}>
          {t(currentLanguage)}
        </Typography>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={event => handleListKeyDown(event)}
                >
                  <MenuItem
                    id="language-en"
                    onClick={e => {
                      handleClose(e)
                      handleChangeLanguage('en')
                    }}
                  >
                    {t('en')}
                  </MenuItem>
                  <MenuItem
                    id="language-es"
                    onClick={e => {
                      handleClose(e)
                      handleChangeLanguage('es')
                    }}
                  >
                    {t('es')}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default LanguageSelector
