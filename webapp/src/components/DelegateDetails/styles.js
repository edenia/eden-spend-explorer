export default theme => ({
  verticalLine: {
    display: 'flex',
    position: 'relative',
    borderLeft: '2px solid rgba(0, 0, 0, 0.12)',
    height: '250',
    width: '2px',
    right: '30px'
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    overflow: 'hidden',
    overflowX: 'hidden',
    with: '100%',
    '& #chart-scroll-id': {
      minWidth: '925px',
      width: '100%'
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  }
})
