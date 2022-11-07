export default (theme, drawerWidth) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  mainContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    height: 'auto',
    overflow: 'auto',
    justifyContent: 'space-between',
    '& .pageContainer': {
      height: 'auto'
    }
  },
  childContent: {
    flex: 1,
    height: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    overflow: 'auto',
    minHeight: '100vh'
  }
})
