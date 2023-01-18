export default theme => ({
  chartContainer: {
    marginTop: theme.spacing(2),
    width: '100%'
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
    marginLeft: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& a ': {
      width: '116px',
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
    marginTop: theme.spacing(0.4),
    marginRight: theme.spacing(1),
    borderRadius: 5
  }
})
