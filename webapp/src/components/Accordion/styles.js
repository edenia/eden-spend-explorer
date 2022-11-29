export default theme => ({
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
  alertContainer: {
    height: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4)
  }
})
