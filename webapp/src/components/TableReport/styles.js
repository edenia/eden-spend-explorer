export default theme => ({
  tableContainer: {
    whiteSpace: 'nowrap',
    overflowY: 'hidden',
    height: 'auto',
    '& .MuiDataGrid-root': {
      border: 'none',
      minWidth: '500px'
    }
  }
})
