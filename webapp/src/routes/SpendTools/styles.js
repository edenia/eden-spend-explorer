export default theme => ({
  root: {
    margin: '8px 16px'
  },
  toolInformation: {
    marginTop: '24px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '8px 16px',
    margin: '16px 0 8px 0',
    [theme.breakpoints.down('sm')]: {
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
    gap: '16px',
    padding: '8px 16px',
    [theme.breakpoints.up('xs')]: {
      maxWidth: '377px'
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
    marginTop: '16px',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      fontSize: '12px'
    },
    '& #id-table-container': {
      marginTop: '16px',
      height: '368.5px'
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
      padding: '0 16px',
      textTransform: 'none'
    },
    '& .MuiButtonBase-root:hover': {
      backgroundColor: '#3866eb'
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
  labelButtonTransfer: {
    lineHeight: 1.14,
    letterSpacing: '1px',
    color: 'white'
  },
  divShadow: {
    border: '1px solid rgb(0 0 0 / 2%)',
    marginTop: '16px',
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
  },
  modalDimentions: {
    maxWidth: '723px',
    minHeight: '605px',
    padding: '20px 32px',
    borderRadius: '7px',
    border: 'solid 1px #667080',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
      width: '80vw'
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
    marginLeft: '5%',
    marginTop: '24px',
    fontSize: '18px',
    fontWeight: '500',
    letterSpacing: '-0.4px',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  dangerText: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
    '& small': {
      color: 'red'
    }
  },
  textModalContainer: {
    marginTop: '24px',
    fontSize: '16px',
    lineHeight: 1.25,
    letterSpacing: '-0.4px',
    color: 'rgba(0, 0, 0, 0.87)',
    marginBottom: '36px'
  }
})
