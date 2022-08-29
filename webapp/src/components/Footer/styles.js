export default theme => ({
  root: {
    padding: '11px 32px',
    backgroundColor: '#eef1f4',
    height: '64px',
    position: 'fixed',
    bottom: 0,
    width: '100%'
  },
  listItem: {
    display: 'inline-block',
    width: 'auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover, &:active:': {
      color: theme.palette.action.selected
    }
  },
  edenInformation: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    '& a ': {
      fontSize: '14px',
      lineHeight: 1.5,
      letterSpacing: '0.08px',
      textAlign: 'left',
      textDecoration: 'none',
      color: '#9e9e9e'
    },
    '& a:hover': {
      color: 'rgba(0, 194, 191, 0.80)'
    }
  },
  creatorInformation: {
    display: 'flex',
    width: '190px',
    '& a': {
      textDecoration: 'none',
      fontSize: '14px',
      lineHeight: 1.43,
      letterSpacing: '0.1px',
      color: '#9e9e9e'
    },
    '& a:hover': {
      color: 'rgba(0, 194, 191, 0.80)'
    },
    '& span': {
      color: 'red'
    }
  }
})
