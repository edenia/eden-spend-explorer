export default theme => ({
  centerSelectableItems: {
    display: 'flex',
    alignItems: 'center'
  },
  spacinTopSidebarItems: {
    paddingTop: theme.spacing(6)
  },
  marginTopItemsSidebar: {
    marginTop: theme.spacing(0.5),
    '& .menu-option-icon': {
      paddingRight: '16px'
    }
  },
  divProfileStyle: {
    cursor: 'pointer'
  }
})
