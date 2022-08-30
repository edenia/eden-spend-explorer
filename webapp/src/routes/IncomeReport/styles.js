export default theme => ({
  title: {
    fontWeight: 'bold',
    fontSize: '32px',
    lineHeight: 1.13,
    letterSpacing: '-0.64px',
    marginLeft: '8px'
  },
  subTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: 1.25,
    letterSpacing: '-0.48px'
  },
  eosPriceContainer: {
    backgroundColor: 'rgba(0, 194, 191, 0.25)',
    [theme.breakpoints.up('300')]: {
      width: '244.4px',
      height: '77px',
      padding: '4.2px 9.9px 7.7px 17px',
      borderRadius: '11.3px'
    }
  },
  eosPriceTitle: {
    [theme.breakpoints.up('300')]: {
      fontSize: '11.3px',
      lineHeight: 1.37,
      letterSpacing: '-0.23px',
      textAlign: 'left'
    }
  },
  eosBalance: {
    [theme.breakpoints.up('300')]: {
      fontSize: '22.6px',
      fontWeight: 'bold',
      lineHeight: 1.12,
      letterSpacing: '-0.45px'
    }
  },
  filtersContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center'
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'end'
    }
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    overflowX: 'auto',
    overflowY: 'auto'
  },
  eosBalanceInDollars: {
    [theme.breakpoints.up('300')]: {
      fontSize: '17px',
      fontWeight: 'bold',
      lineHeight: 1.25,
      letterSpacing: '-0.34px'
    }
  }
})
