export default theme => ({
  footerRoot: {
    width: '100%',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
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
    display: 'flex',
    paddingTop: theme.spacing(1),
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
