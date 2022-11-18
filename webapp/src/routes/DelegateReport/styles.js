export default theme => ({
  root: {
    margin: theme.spacing(1)
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
        marginTop: theme.spacing(1)
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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      textAlign: 'center',
      flexWrap: 'wrap'
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'center'
    }
  }
})
