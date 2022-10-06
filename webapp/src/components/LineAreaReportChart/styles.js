export default theme => ({
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    overflowX: 'hidden',
    with: '100%',
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
  }
})
