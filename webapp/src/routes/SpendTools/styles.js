export default theme => ({
  root: {
    margin: theme.spacing(2, 3),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  toolInformation: {
    marginTop: theme.spacing(3)
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 2),
    margin: theme.spacing(2, 0, 1, 0),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 0, 0, 0),
      padding: theme.spacing(0),
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0
    }
  },
  inputContainer: {
    height: '74px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: '4px',
    '& .MuiFormLabel-root': {
      fontSize: '14px',
      lineHeight: '1.57',
      letterSpacing: '-0.28px',
      color: '#667080'
    },
    '& .MuiInputBase-input': {
      padding: '13px 25px 13px 25px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'solid 1px #667080'
    },
    '& small': {
      color: 'red'
    }
  },
  specialInput: {
    width: '100%',
    '& #labels-id': {
      display: 'flex',
      justifyContent: 'space-between'
    },
    '& #amount-id': {
      fontSize: '14px',
      lineHeight: '1.57',
      letterSpacing: '-0.28px',
      color: '#667080'
    },
    '& #available-id': {
      fontSize: '12px',
      lineHeight: 1.83,
      letterSpacing: '-0.24px'
    },
    '& .MuiInputBase-input': {
      padding: '13px 25px 13px 25px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'solid 1px #667080'
    },
    '& small': {
      color: 'red'
    },
    '& .MuiFormHelperText-root': {
      color: '#000'
    }
  },
  rowFormContainer: {
    height: '202px',
    width: '100%',
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 2),
    [theme.breakpoints.up('xs')]: {
      maxWidth: '377px'
    },
    [theme.breakpoints.down('sm')]: {
      height: '185px',
      padding: theme.spacing(0)
    }
  },
  selectForm: {
    alignSelf: 'stretch',
    height: '48px',
    borderRadius: '6px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#667080'
    },
    '& #placeholder-select': {
      color: '#aaa'
    }
  },
  tableContainer: {
    minWidth: '920px',
    marginTop: theme.spacing(2),
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: '12px'
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& #id-table-container': {
      marginTop: theme.spacing(2),
      height: '369px',
      [theme.breakpoints.down('sm')]: {
        height: '400px'
      }
    }
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    '& .MuiButtonBase-root': {
      width: '345px',
      height: '48px',
      backgroundColor: '#2563eb',
      borderRadius: 0,
      padding: theme.spacing(0, 2),
      textTransform: 'none'
    },
    '& .MuiButtonBase-root:hover': {
      backgroundColor: '#3866eb'
    },
    '& .spinnerStyle': {
      color: 'white'
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
      color: theme.palette.primary.main
    }
  },
  labelButtonTransfer: {
    lineHeight: 1.14,
    letterSpacing: '1px',
    color: 'white'
  },
  modalDimentions: {
    width: '723px',
    height: '605px',
    padding: '20px 32px',
    borderRadius: '7px',
    border: 'solid 1px #667080',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('md')]: {
      width: '80vw'
    },
    [theme.breakpoints.down('sm')]: {
      overflow: 'auto'
    },
    '& #close-modal-button-id': {
      position: 'absolute',
      right: 8,
      top: 8
    }
  },
  titleModal: {
    fontSize: '30px',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.23px'
  },
  formModalContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px'
  },
  titleTable: {
    marginTop: theme.spacing(3),
    fontSize: '18px',
    fontWeight: '500',
    letterSpacing: '-0.4px',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  dangerText: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: theme.spacing(1),
    '& small': {
      color: 'red'
    }
  },
  textModalContainer: {
    marginTop: theme.spacing(3),
    fontSize: '16px',
    lineHeight: 1.25,
    letterSpacing: '-0.4px',
    color: 'rgba(0, 0, 0, 0.87)',
    marginBottom: theme.spacing(5)
  }
})
