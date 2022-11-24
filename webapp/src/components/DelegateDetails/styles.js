export default theme => ({
  verticalLine: {
    borderLeft: '1px solid rgba(225,225,225,.99)',
    borderBottom: '1px solid rgba(225,225,225,.99)',
    marginBottom: theme.spacing(1)
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
  },
  alertContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(4)
  }
})
