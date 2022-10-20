export default theme => ({
  root: {
    marginRight: '8px',
    marginLeft: '8px',
    '& #titles-container-id': {
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.down('450')]: {
        flexDirection: 'column'
      }
    }
  },
  title: {
    fontWeight: 'bold',
    fontSize: '32px',
    lineHeight: 1.13,
    letterSpacing: '-0.64px',
    marginLeft: '8px'
  },
  subTitle: {
    textAlign: 'justify',
    marginLeft: '12px',
    '& span': {
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: 1.25,
      letterSpacing: '-0.48px',
      [theme.breakpoints.down('550')]: {
        marginTop: '16px'
      }
    }
  },
  filtersContainer: {
    marginTop: '24px',
    '& #id-radio-election-container': {
      display: 'flex',
      marginLeft: '12px',
      justifyContent: 'end',
      alignItems: 'center'
    },
    '& #id-select-election-container': {
      minHeight: '50px',
      display: 'flex',
      marginLeft: '12px',
      justifyContent: 'end',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        marginTop: 8,
        borderTop: '1px solid',
        textAlign: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
      [theme.breakpoints.up('sm')]: {
        textAlign: 'center'
      }
    }
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    overflowX: 'hidden',
    with: '100%',
    '& #chart-scroll-id': {
      minWidth: '925px',
      width: '100%'
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  divider: {
    width: '4px',
    height: '31px',
    backgroundColor: '#00c2bf'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  tableContainer: {
    marginTop: '80px',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      color: theme.palette.secondary.main
    },
    '& .MuiDataGrid-cell': {
      color: theme.palette.secondary.main
    },
    '& #id-table-container': {
      marginTop: '16px',
      height: 368
    }
  },
  chartLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '400px',
    '& a ': {
      display: 'flex',
      textAlign: 'center',
      textDecoration: 'none',
      color: theme.palette.secondary.main,
      marginTop: '2px'
    },
    '& a:hover': {
      color: 'rgba(0, 194, 191, 0.80)'
    }
  },
  links: {
    '& a ': {
      display: 'flex',
      textAlign: 'center',
      textDecoration: 'none',
      color: theme.palette.secondary.main,
      marginTop: '2px'
    },
    '& a:hover': {
      color: 'rgba(0, 194, 191, 0.80)'
    }
  },
  disableLink: {
    pointerEvents: 'none',
    cursor: 'pointer'
  }
})
