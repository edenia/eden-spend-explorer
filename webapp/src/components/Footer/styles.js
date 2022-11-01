export default theme => ({
  footerRoot: {
    width: '100%',
    backgroundColor: theme.palette.grey[600],
    '& .footer-item-style': {
      color: 'rgba(163,163,163,1) !important',
      fontSize: '16px !important',
      margin: '2px 0',
      display: 'grid'
    },
    '& .footer-item-title': {
      letterSpacing: '.1em',
      fontSize: '.875rem',
      lineHeight: '1.25rem'
    }
  },
  footerContainer: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTypography-caption': {
      fontSize: '16px !important'
    }
  },
  linkStyle: {
    display: 'flex',
    alignItems: 'center'
  }
})
