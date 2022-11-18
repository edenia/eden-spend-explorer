export default theme => ({
  chartContainer: {
    margin: '16px 0 16px 0'
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
    marginTop: 3,
    marginRight: 8,
    borderRadius: 5
  }
})
