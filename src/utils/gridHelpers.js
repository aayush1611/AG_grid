export const saveColumnState = (columnApi) => {
  if (columnApi) {
    const state = columnApi.getColumnState()
    window.localStorage.setItem('columnState', JSON.stringify(state))
  }
}

export const loadColumnState = (columnApi) => {
  const state = window.localStorage.getItem('columnState')
  if (state && columnApi) {
    try {
      columnApi.applyColumnState({ 
        state: JSON.parse(state), 
        applyOrder: true 
      })
    } catch (error) {
      console.warn('Failed to load column state:', error)
    }
  }
}

export const resetColumnState = (columnApi) => {
  if (columnApi) {
    columnApi.resetColumnState()
  }
  window.localStorage.removeItem('columnState')
}

export const autoSizeColumns = (columnApi) => {
  if (columnApi) {
    const allCols = columnApi.getColumns() || []
    columnApi.autoSizeColumns(allCols, false)
  }
}

export const exportToCsv = (api, fileName = 'employees.csv') => {
  if (api) {
    api.exportDataAsCsv({ fileName })
  }
}

export const toggleRowDensity = (api) => {
  if (api) {
    const current = api.getGridOption('rowHeight') || 42
    const next = current > 42 ? 42 : 60
    api.setGridOption('rowHeight', next)
    api.onRowHeightChanged()
  }
}

export const buildFilterModel = (department, location, status) => {
  const filterModel = {}
  
  if (department !== 'all') {
    filterModel['department'] = { 
      filterType: 'text', 
      type: 'equals', 
      filter: department 
    }
  }
  
  if (location !== 'all') {
    filterModel['location'] = { 
      filterType: 'text', 
      type: 'equals', 
      filter: location 
    }
  }
  
  if (status !== 'all') {
    filterModel['Status'] = { 
      filterType: 'text', 
      type: 'equals', 
      filter: status === 'active' ? 'Active' : 'Inactive' 
    }
  }
  
  return filterModel
} 