export default theme => ({
  root: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  subTitle: {
    display: 'block'
  },
  text: {
    whiteSpace: 'pre-line',
    display: 'block',
    marginBottom: theme.spacing(2),
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.15px'
  },
  title: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.56,
    letterSpacing: '-0.4px'
  },
  horizontalLine: {
    borderBottom: '1px solid rgba(225,225,225,.99)',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  imagesContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  imgBalance: {
    [theme.breakpoints.down('sm')]: {
      width: '60%',
      height: '100%'
    }
  },
  images: {
    display: 'block',
    marginRight: 'auto',
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%'
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
