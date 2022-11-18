export default theme => ({
  root: {
    margin: '8px'
  },
  spinner: {
    textAlign: 'center',
    marginTop: '20vh'
  },
  headPage: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& #treasury-container-id': {
        marginTop: '8px'
      }
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    }
  },
  filtersContainer: {
    marginTop: '24px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 8,
      textAlign: 'center',
      flexWrap: 'wrap'
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    }
  }
})
