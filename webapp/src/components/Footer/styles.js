export default theme => ({
  root: {
    padding: theme.spacing(2),
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
  }
})
