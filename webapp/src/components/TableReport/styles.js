export default theme => ({
  tableContainer: {
    whiteSpace: 'nowrap',
    overflowY: 'hidden',
    height: '100%',
    '& .MuiDataGrid-root': {
      border: 'none',
      minWidth: '600px'
    }
  }
})
