export default theme => ({
  chartContainer: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 24,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  labelContainer: {
    display: 'flex'
  }
})
