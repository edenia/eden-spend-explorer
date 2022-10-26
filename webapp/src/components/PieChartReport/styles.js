export default theme => ({
  chartContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 24,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch'
  }
})
