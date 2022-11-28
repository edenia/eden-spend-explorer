export default theme => ({
  accordionContainer: {
    '& .MuiPaper-root': {
      boxShadow: 'none'
    },
    '& .MuiAccordionDetails-root': {
      padding: theme.spacing(1, 0, 2)
    },
    '& .delegate-bp-item-container': {
      width: '100%'
    },
    '& .hideData': {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    }
  }
})
