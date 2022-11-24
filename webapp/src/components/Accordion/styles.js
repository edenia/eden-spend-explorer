export default theme => ({
  summaryContentStyle: {
    '& .delegate-bp-item-container': {
      width: '100%',
      borderBottom: 'none'
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
