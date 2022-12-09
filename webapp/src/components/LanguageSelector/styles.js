export default theme => ({
  paddingIcon: {
    paddingRight: theme.spacing(1),
    display: 'flex'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  languageLabel: {
    color: theme.palette.common.black,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
})
