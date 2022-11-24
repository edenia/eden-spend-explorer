export default theme => ({
  chartContainer: {
    margin: theme.spacing(2, 0, 2, 0)
  },
  title: {
    '& span': {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    }
  },
  filter: {
    '& span': {
      fontSize: '12px',
      fontWeight: 300,
      lineHeight: 1.33,
      letterSpacing: '-0.26px'
    }
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
