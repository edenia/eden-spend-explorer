export default theme => ({
  main: { '& .MuiDrawer-paper': { borderWidth: 1 } },
  brand: {
    backgroundColor: theme.palette.primaryLight.main,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    '& img': {
      width: '36px',
      height: '36px'
    },
    '& img:hover': {
      cursor: 'pointer'
    },
    '& span': {
      fontSize: '16px',
      fontWeight: 'normal',
      lineHeight: '1.38',
      letterSpacing: '-0.32px',
      color: '#667080'
    }
  },
  scrollbar: {
    backgroundColor: theme.palette.primaryLight.main
  },
  badge: {
    fontWeight: theme.typography.fontWeightBold,
    height: '20px',
    backgroundColor: theme.palette.primary.main,
    '& span.MuiChip-label, & span.MuiChip-label:hover': {
      cursor: 'pointer',
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(0, 1)
    }
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    '& p': {
      fonWeight: theme.typography.fontWeightBold,
      paddingLeft: theme.spacing(2),
      cursor: 'default'
    },
    '& .MuiListItem-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      width: '234px',
      margin: 'auto'
    },
    '& .MuiCollapse-container': {
      width: '100%',
      paddingLeft: theme.spacing(2)
    },
    '& .MuiListItemText-root .MuiTypography-root': {
      fontSize: theme.typography.subtitle2.fontSize
    },
    '& .active': {
      backgroundColor: 'rgba(0, 194, 191, 0.25)'
    },
    '& .active:hover': {
      backgroundColor: 'rgba(0, 194, 191, 0.80)'
    }
  },
  ellipseContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  ellipse: {
    marginTop: '24px',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    flexGrow: 0,
    margin: '0 0 4px',
    padding: '12px',
    backgroundColor: '#00c2bf'
  },
  divider: {
    width: '235px',
    height: '2px',
    marginTop: '16px',
    marginBottom: '12px',
    margin: 'auto',
    backgroundColor: '#00c2bf'
  }
})
