export default theme => ({
  chartContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginTop: 24,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  filtersChartContainer: {
    display: 'flex',
    marginLeft: '70px'
  }
})
