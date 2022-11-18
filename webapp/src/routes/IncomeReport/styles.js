export default theme => ({
  root: {
    margin: '8px',
    '& #treasury-container-id': {
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('450')]: {
        flexDirection: 'column'
      }
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
    marginTop: '16px',
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
  tableContainer: {
    marginTop: '24px',
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
  }
})
