export default theme => ({
  root: {
    margin: theme.spacing(1),
    '& #treasury-container-id': {
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center'
      }
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  spinner: {
    textAlign: 'center',
    marginTop: '20vh'
  },
  headPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  title: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      width: '100%'
    }
  },
  filtersContainer: {
    width: '50%',
    margin: theme.spacing(2, 0, 2, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    '& #combo-box-id': {
      width: '100%',
      maxWidth: '308px',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%'
      }
    },

    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      width: '100%',
      margin: theme.spacing(2, 0, 2, 0)
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    }
  },
  accordionContainer: {
    '& .MuiPaper-root': {
      boxShadow: 'none'
    },
    '& .MuiAccordionDetails-root': {
      padding: theme.spacing(1, 0, 2)
    },
    '& .delegate-bp-item-container': {
      width: '100%',
      borderBottom: 'none'
    },
    '& .hideData': {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    }
  },
  alertAccordionContainer: {
    height: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4)
  },
  verticalLine: {
    borderLeft: '1px solid rgba(225,225,225,.99)',
    borderBottom: '1px solid rgba(225,225,225,.99)',
    marginBottom: theme.spacing(1)
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      flexDirection: 'column'
    }
  },
  pieChartContainer: {
    width: '35vw',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  alertDetailContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4)
  }
})
