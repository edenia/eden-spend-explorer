export default theme => ({
  root: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  subTitle: {
    display: 'block',
    margin: theme.spacing(2, 0, 2, 0),
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.15px'
  },
  paragraph: {
    display: 'block',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  text: {
    whiteSpace: 'pre-line',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.15px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.56,
    letterSpacing: '-0.4px'
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'center',
    '& img': {
      width: '100%',
      maxWidth: '1100px'
    },
    '& #balance': {
      maxWidth: '366px'
    },
    '& #spendTool': {
      maxWidth: '720px'
    },
    '& #categorizedSpend': {
      maxWidth: '470px'
    }
  },
  boxLinks: {
    display: 'flex',
    marginTop: theme.spacing(3),
    '& a': {
      '&:hover': {
        textDecoration: 'none'
      }
    },
    '& svg': {
      marginRight: theme.spacing(3)
    },
    '& p': {
      marginTop: 0
    }
  }
})
