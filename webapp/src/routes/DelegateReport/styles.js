export default theme => ({
  root: {
    marginRight: '8px',
    marginLeft: '8px',
    '& #treasury-container-id': {
      display: 'flex',
      position: 'relative',
      left: '43%',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('450')]: {
        flexDirection: 'column'
      }
    }
  },
  content: {
    textAlign: 'center'
  },
  spinner: {
    marginTop: '20vh'
  },
  headPage: {
    display: 'flex'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  filtersContainer: {
    marginTop: '24px',
    '& #id-radio-election-container': {
      display: 'flex',
      marginLeft: '12px',
      justifyContent: 'end',
      alignItems: 'center'
    },
    '& #id-select-election-container': {
      minHeight: '50px',
      display: 'flex',
      marginLeft: '12px',
      justifyContent: 'end',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        marginTop: 8,
        borderTop: '1px solid',
        textAlign: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
      [theme.breakpoints.up('sm')]: {
        textAlign: 'center'
      }
    }
  }
})
