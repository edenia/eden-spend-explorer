export default (theme, drawerWidth) => ({
  root: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    overflow: 'hidden',
    height: 'calc(100vh - 48px)'
  },
  childContent: {
    flex: 1,
    height: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    overflow: 'auto'
  }
})
