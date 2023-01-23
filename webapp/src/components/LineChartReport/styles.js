export default theme => ({
  root: {
    margin: theme.spacing(3, 0, 3, 0)
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
  },
  buttonFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    '& button': {
      margin: 8,
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: '#2563eb'
    }
  }
})
