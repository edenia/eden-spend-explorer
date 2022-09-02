export default theme => ({
  main: { '& .MuiDrawer-paper': { borderWidth: 1 } },
  brand: {
    backgroundColor: theme.palette.primaryLight.main,
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
    '& img': {
      width: 'auto',
      height: '125px'
    },
    '& img:hover': {
      cursor: 'pointer'
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
  }
})
