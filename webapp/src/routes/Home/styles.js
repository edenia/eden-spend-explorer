export default theme => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    '& .MuiButton-root': {
      width: '150px',
      height: '36px',
      backgroundColor: '#2563eb',
      borderRadius: 0,
      padding: '6px 12px',
      textTransform: 'none'
    },
    '& .MuiButton-root:hover': {
      backgroundColor: '#3866eb'
    }
  },
  labelButton: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.14,
    letterSpacing: '1px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center'
  },
  titleContainer: {
    height: '216px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  titleStyles: {
    fontSize: '64px',
    fontWeight: 'bold',
    lineHeight: 1.13,
    letterSpacing: '-0.75px',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '32px'
    }
  },
  subtitleStyles: {
    marginTop: theme.spacing(2),
    maxWidth: '420px',
    letterSpacing: '0.15px',
    fontSize: '16px',
    fontFamily: 'Roboto'
  },
  boxesContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      flexDirection: 'column'
    }
  },
  frameContainer: {
    width: '323px',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 'auto'
    }
  },
  titleFrame: {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '32px',
    marginTop: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(4),
      fontSize: '24px'
    }
  },
  subtitleFrame: {
    display: 'flex',
    justifyContent: 'center'
  },
  bodyFrame: {
    fontSize: '14px',
    lineHeight: 1.29,
    letterSpacing: '-0.4px'
  },
  imageLine: {
    position: 'absolute',
    width: '80%',
    maxWidth: '1000px',
    top: 80,
    zIndex: -1,
    height: '4px',
    backgroundColor: 'rgba(37, 99, 235, 0.5)',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})
