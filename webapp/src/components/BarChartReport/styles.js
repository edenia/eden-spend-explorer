export default theme => ({
  root: {
    margin: theme.spacing(6, 6, 6, 6),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(6, 1, 6, 1)
    }
  },
  chartContainer: {
    whiteSpace: 'nowrap',
    overflowY: 'hidden',
    [theme.breakpoints.down('sm')]: {
      overflowX: 'hidden'
    }
  },
  title: {
    '& span': {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    }
  },
  filter: {
    '& span': {
      fontSize: '12px',
      fontWeight: 300,
      lineHeight: 1.33,
      letterSpacing: '-0.26px'
    }
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chartLegent: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& a ': {
      display: 'flex',
      textAlign: 'left',
      textDecoration: 'none',
      fontSize: '12px'
    },
    '& a:hover': {
      pointerEvents: 'none'
    }
  },
  legentCircle: {
    width: 12,
    height: 12,
    marginLeft: '4vw',
    marginTop: theme.spacing(0.4),
    marginRight: theme.spacing(1),
    borderRadius: 5
  }
})
