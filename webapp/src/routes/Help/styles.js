export default theme => ({
  root: {
    margin: theme.spacing(1),
    '& #treasury-container-id': {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  title: {
    '& h6': {
      [theme.breakpoints.down('sm')]: {
        fontSize: '1px'
      }
    }
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
