export default theme => ({
  root: {
    margin: theme.spacing(1),
    '& #treasury-container-id': {
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center'
      }
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  title: {
    '& span': {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    }
  },
  filtersContainer: {
    marginTop: theme.spacing(2),
    '& #id-radio-election-container': {
      display: 'flex',
      marginLeft: '12px',
      justifyContent: 'end',
      alignItems: 'center'
    },
    '& span': {
      fontSize: '12px',
      fontWeight: 300,
      lineHeight: 1.33,
      letterSpacing: '-0.26px'
    }
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      flexDirection: 'column'
    }
  },
  pieChartContainer: {
    width: '35vw',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      color: theme.palette.secondary.main
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-cell': {
      color: theme.palette.secondary.main
    },
    '& #id-table-container': {
      marginTop: theme.spacing(2)
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
      color: '#1565c0'
    }
  },
  disableLink: {
    pointerEvents: 'none',
    cursor: 'pointer'
  },
  dividerLine: {
    borderLeft: '1px solid rgba(225,225,225,.99)',
    borderBottom: '1px solid rgba(225,225,225,.99)',
    marginBottom: theme.spacing(1)
  }
})
