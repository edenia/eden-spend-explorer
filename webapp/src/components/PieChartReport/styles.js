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
  titleContainer: {
    display: 'flex'
  },
  titleContainerExpense: {
    display: 'flex',
    width: '90%',
    height: '65px',
    borderBottom: '2px solid rgba(0, 0, 0, 0.12)'
  },
  textContainer: {
    textAlign: 'justify',
    marginLeft: '12px',
    '& span': {
      alignSelf: 'stretch',
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    }
  },
  filtersChartContainer: {
    display: 'flex',
    position: 'relative',
    left: '10%',
    alignItems: 'center'
  },
  titleChart: {
    textAlign: 'justify',
    marginLeft: '12px',
    alignSelf: 'stretch',
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.56,
    letterSpacing: '-0.4px'
  }
})
