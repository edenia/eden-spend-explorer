export default theme => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
    '& .css-1exfphm-MuiButtonBase-root-MuiButton-root': {
      width: '191px',
      height: '36px',
      backgroundColor: '#2563eb',
      borderRadius: 0,
      padding: '6px 12px',
      textTransform: 'none'
    },
    '& .css-1exfphm-MuiButtonBase-root-MuiButton-root:hover': {
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
    height: '316px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '16px',
    textAlign: 'center'
  },
  titleStyles: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.6px',
    color: '#000',
    marginTop: '16px'
  },
  subtitleStyles: {
    marginTop: '16px',
    maxWidth: '420px',
    letterSpacing: '0.15px',
    color: '#000',
    fontSize: '16px',
    fontFamily: 'Roboto'
  },
  boxesContainer: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      flexDirection: 'column'
    }
  },
  frameContainer: {
    width: '323px',
    margin: '16px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto'
    }
  },
  titleFrame: {
    fontWeight: 500,
    fontSize: '18px',
    color: '#000',
    lineHeight: 1.56,
    letterSpacing: '-0.4px'
  },
  bodyFrame: {
    fontSize: '16px important!',
    color: '#667080',
    lineHeight: 1.56,
    letterSpacing: '-0.4px'
  }
})
