export default theme => ({
  verticalLine: {
    borderLeft: '1px solid rgba(225,225,225,.99)',
    borderBottom: '1px solid rgba(225,225,225,.99)',
    marginBottom: '8px'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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
  }
})
