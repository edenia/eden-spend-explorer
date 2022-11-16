export default theme => ({
  chartContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 24
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
    alignItems: 'center',
    marginLeft: '30px',
    width: '90%',
    height: '65px'
  },
  filtersChartContainer: {
    display: 'flex',
    position: 'relative',
    left: '10%',
    alignItems: 'center'
  }
})
