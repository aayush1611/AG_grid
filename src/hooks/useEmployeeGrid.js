import { useState, useEffect, useCallback, useMemo } from 'react'
import { calculateStats, getUniqueValues } from '../utils/calculations'
import { buildFilterModel, loadColumnState } from '../utils/gridHelpers'
import employeesData from '../data/employees.json'

export const useEmployeeGrid = () => {
  const [themeDark, setThemeDark] = useState(false)
  const [quick, setQuick] = useState('')
  const [department, setDepartment] = useState('all')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState('all')
  const [pageSize, setPageSize] = useState(10)
  const [rowData, setRowData] = useState(employeesData.employees || [])

  const stats = useMemo(() => calculateStats(rowData), [rowData])
  const departments = useMemo(() => getUniqueValues(rowData, 'department'), [rowData])
  const locations = useMemo(() => getUniqueValues(rowData, 'location'), [rowData])

  const onGridReady = useCallback((params) => {
    loadColumnState(params.columnApi)
  }, [])

  const handleQuickFilter = useCallback((gridRef, value) => {
    setQuick(value)
    if (gridRef.current?.api) {
      gridRef.current.api.setQuickFilter(value)
    }
  }, [])

  const applyFilterModels = useCallback((gridRef) => {
    if (!gridRef.current?.api) return
    const filterModel = buildFilterModel(department, location, status)
    gridRef.current.api.setFilterModel(filterModel)
  }, [department, location, status])

  const clearAllFilters = useCallback((gridRef) => {
    setDepartment('all')
    setLocation('all')
    setStatus('all')
    setQuick('')
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null)
      gridRef.current.api.setQuickFilter('')
    }
  }, [])

  return {
    // State
    themeDark,
    setThemeDark,
    quick,
    setQuick,
    department,
    setDepartment,
    location,
    setLocation,
    status,
    setStatus,
    pageSize,
    setPageSize,
    rowData,
    setRowData,
    
    // Computed values
    stats,
    departments,
    locations,
    
    // Handlers
    onGridReady,
    handleQuickFilter,
    applyFilterModels,
    clearAllFilters
  }
} 