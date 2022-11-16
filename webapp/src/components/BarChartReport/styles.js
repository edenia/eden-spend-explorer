export default theme => ({
  chartContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginTop: 24,
    '& #chart-scroll-id': {
      minWidth: '925px',
      width: '100%'
    }
  },
  chartLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '400px',
    '& a ': {
      display: 'flex',
      textAlign: 'left',
      textDecoration: 'none',
      color: theme.palette.secondary.main,
      marginTop: '2px',
      width: '160px'
    },
    '& a:hover': {
      color: 'rgba(0, 194, 191, 0.80)'
    }
  },
  disableLink: {
    pointerEvents: 'none',
    cursor: 'pointer'
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  filtersChartContainer: {
    display: 'flex',
    marginLeft: '400px'
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
