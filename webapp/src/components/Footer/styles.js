export default theme => ({
  root: {
    padding: '11px 32px',
    backgroundColor: theme.palette.primaryLight.main,
    width: '100%',
    borderTop: '1px solid'
  },
  footerInformation: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    '& a ': {
      fontSize: '14px',
      lineHeight: 1.5,
      letterSpacing: '0.08px',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#9e9e9e',
      marginTop: '2px'
    },
    '& a:hover': {
      color: 'rgba(0, 194, 191, 0.80)'
    },

    '& span': {
      color: 'red'
    },
    '& img': {
      filter: 'invert(0.6)'
    }
  }
})
