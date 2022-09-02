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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
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
