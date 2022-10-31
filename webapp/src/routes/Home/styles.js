export default theme => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    '& .css-1exfphm-MuiButtonBase-root-MuiButton-root': {
      width: '191px',
      height: '36px',
      backgroundColor: '#2563eb',
      borderRadius: 0,
      padding: '6px 12px',
      textTransform: 'none'
    },
    '& .css-1exfphm-MuiButtonBase-root-MuiButton-root:hover': {
      backgroundColor: '#3866eb'
    }
  },
  labelButton: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.14,
    letterSpacing: '1px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center'
  }
})
