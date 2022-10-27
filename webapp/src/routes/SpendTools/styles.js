export default theme => ({
  inputForm: {
    '& .MuiInputBase-input': {
      alignSelf: 'stretch',
      flexGrow: 1,
      borderRadius: '6px',
      border: 'solid 1px #667080',
      backgroundColor: '#fff',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow'
      ])
    }
  }
})
