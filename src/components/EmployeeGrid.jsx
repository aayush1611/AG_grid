import React, { useRef, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { useEmployeeGrid } from '../hooks/useEmployeeGrid'
import { getColumnDefs, defaultColDef } from '../config/columnDefs'
import StatsSection from './StatsSection'
import GridToolbar from './GridToolbar'
import { 
  exportToCsv, 
  autoSizeColumns, 
  saveColumnState, 
  resetColumnState, 
  toggleRowDensity 
} from '../utils/gridHelpers'

export default function EmployeeGrid() {
  const gridRef = useRef(null)
  const {
    // State
    themeDark,
    setThemeDark,
    quick,
    department,
    setDepartment,
    location,
    setLocation,
    status,
    setStatus,
    rowData,
    
    // Computed values
    stats,
    departments,
    locations,
    
    // Handlers
    onGridReady,
    handleQuickFilter,
    applyFilterModels,
    clearAllFilters
  } = useEmployeeGrid()

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilterModels(gridRef)
  }, [applyFilterModels])

  // Toolbar event handlers
  const handleQuickChange = (e) => {
    handleQuickFilter(gridRef, e.target.value)
  }

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value)
  }

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const handleClearFilters = () => {
    clearAllFilters(gridRef)
  }

  const handleExportCsv = () => {
    exportToCsv(gridRef.current?.api)
  }

  const handleAutoSize = () => {
    autoSizeColumns(gridRef.current?.columnApi)
  }

  const handleSaveLayout = () => {
    saveColumnState(gridRef.current?.columnApi)
  }

  const handleResetLayout = () => {
    resetColumnState(gridRef.current?.columnApi)
  }

  const handleToggleDensity = () => {
    toggleRowDensity(gridRef.current?.api)
  }

  const handleToggleTheme = () => {
    setThemeDark(prev => !prev)
  }

  const containerClass = `ag-theme-quartz${themeDark ? '-dark' : ''}`

  return (
    <div className="grid-page">
      <StatsSection 
        rowData={rowData}
        avgSalary={stats.avgSalary}
        avgPerf={stats.avgPerf}
      />

      <GridToolbar
        quick={quick}
        onQuickChange={handleQuickChange}
        department={department}
        onDepartmentChange={handleDepartmentChange}
        departments={departments}
        location={location}
        onLocationChange={handleLocationChange}
        locations={locations}
        status={status}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
        onExportCsv={handleExportCsv}
        onAutoSize={handleAutoSize}
        onSaveLayout={handleSaveLayout}
        onResetLayout={handleResetLayout}
        onToggleDensity={handleToggleDensity}
        onToggleTheme={handleToggleTheme}
      />

      <div className={`grid-wrapper ${containerClass}`}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={getColumnDefs()}
          defaultColDef={defaultColDef}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  )
}
