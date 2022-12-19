import React from 'react'
import { makeStyles } from '@mui/styles'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation } from 'react-i18next'

import styles from './styles'

const useStyles = makeStyles(styles)

const Help = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel, account) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const { i18n } = useTranslation()

  return (
    <div className={classes.root}>
      <Accordion
        expanded={expanded === 'panel'}
        onChange={handleChange('panel')}
      >
        <AccordionSummary
          aria-controls="user-roles-access"
          id="user-roles-access"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6" className={classes.title}>
            User Roles Access
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <img
            src={
              i18n.language === 'es'
                ? '/images/role-access-EN.webp'
                : '/images/role-access-EN.webp'
            }
            width={450}
            height={250}
            className={classes.images}
          />
          <Typography>......</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          aria-controls="understand-data"
          id="understand-data"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6" className={classes.title}>
            How to view and understand the data?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <img
            src={
              i18n.language === 'es'
                ? '/images/balance-ES.webp'
                : '/images/balance-EN.webp'
            }
            width={366}
            height={120}
            className={classes.imgBalance}
          />
          <Typography>......</Typography>
          <Divider variant="middle" />
          <div className={classes.imagesContainer}>
            <img
              src={
                i18n.language === 'es'
                  ? '/images/charts-ES.webp'
                  : '/images/charts-EN.webp'
              }
              width={1320}
              height={351}
              className={classes.images}
            />
          </div>
          <Typography>......</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          aria-controls="spend-tools"
          id="spend-tools"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6" className={classes.title}>
            Spend Tools
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <img
            src={
              i18n.language === 'es'
                ? '/images/spend-tools-ES.webp'
                : '/images/spend-tools-ES.webp'
            }
            width={720}
            height={311}
            className={classes.imgBalance}
          />
          <Typography>......</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default Help
