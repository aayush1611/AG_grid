import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import employeesData from '../data/employees.json'

function StatCard({label, value, hint}){
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  )
}

export default function EmployeeGrid(){
  const gridRef = useRef(null)
  const [themeDark, setThemeDark] = useState(false)
  const [quick, setQuick] = useState('')
  const [department, setDepartment] = useState('all')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState('all')
  const [rowData, setRowData] = useState(employeesData.employees || [])

  const { avgSalary, avgPerf } = useMemo(() => {
    if(!rowData.length) return { avgSalary: 0, avgPerf: 0 }
    const totalSalary = rowData.reduce((a, r) => a + (r.salary||0), 0)
    const totalPerf = rowData.reduce((a, r) => a + (r.performanceRating||0), 0)
    return {
      avgSalary: Math.round(totalSalary/rowData.length),
      avgPerf: (totalPerf/rowData.length).toFixed(2)
    }
  }, [rowData])

  const departments = useMemo(() => ['all', ...Array.from(new Set(rowData.map(r => r.department)))], [rowData])
  const locations = useMemo(() => ['all', ...Array.from(new Set(rowData.map(r => r.location)))], [rowData])

  const currencyFormatter = params => (params.value != null ? params.value.toLocaleString(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0}) : '—')
  const dateValueFormatter = params => {
    if(!params.value) return '—'
    const d = new Date(params.value)
    if(Number.isNaN(d.getTime())) return params.value
    return d.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: '2-digit'})
  }
  const perfRenderer = params => {
    const v = Number(params.value || 0)
    const pct = Math.round((v/5)*100)
    return (
      <div className="perf-wrap" title={`${v} / 5`}>
        <div className="perf-bar"><span style={{width: pct + '%'}} /></div>
        <span className="perf-text">{v}</span>
      </div>
    )
  }
  const skillsRenderer = params => {
    const arr = params.value || []
    return <div className="chip-row">{arr.map((s, i) => <span className="chip" key={i}>{s}</span>)}</div>
  }
  const emailRenderer = params => {
    const e = params.value
    return e ? <a href={`mailto:${e}`} className="link">{e}</a> : '—'
  }
  const activeValueGetter = params => (params.data?.isActive ? 'Active' : 'Inactive')

  const columnDefs = useMemo(() => [
    { headerName: 'ID', field: 'id', width: 90, filter: 'agNumberColumnFilter', pinned: 'left' },
    { headerName: 'Name', valueGetter: p => `${p.data.firstName} ${p.data.lastName}`, minWidth: 160, flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Email', field: 'email', cellRenderer: emailRenderer, minWidth: 220, filter: 'agTextColumnFilter' },
    { headerName: 'Department', field: 'department', minWidth: 140, filter: 'agTextColumnFilter' },
    { headerName: 'Position', field: 'position', minWidth: 160, filter: 'agTextColumnFilter' },
    { headerName: 'Location', field: 'location', minWidth: 130, filter: 'agTextColumnFilter' },
    { headerName: 'Salary', field: 'salary', valueFormatter: currencyFormatter, minWidth: 140, filter: 'agNumberColumnFilter' },
    { headerName: 'Hire Date', field: 'hireDate', valueFormatter: dateValueFormatter, filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue)
          if (cellDate < filterLocalDateAtMidnight) return -1
          if (cellDate > filterLocalDateAtMidnight) return 1
          return 0
        }
      }
    },
    { headerName: 'Age', field: 'age', width: 110, filter: 'agNumberColumnFilter' },
    { headerName: 'Perf.', field: 'performanceRating', width: 130, filter: 'agNumberColumnFilter', cellRenderer: perfRenderer },
    { headerName: 'Projects', field: 'projectsCompleted', width: 120, filter: 'agNumberColumnFilter' },
    { headerName: 'Status', valueGetter: activeValueGetter, width: 120, filter: 'agTextColumnFilter',
      cellClass: p => (p.data?.isActive ? 'ok' : 'warn') },
    { headerName: 'Skills', field: 'skills', minWidth: 250, filter: false, cellRenderer: skillsRenderer },
    { headerName: 'Manager', field: 'manager', minWidth: 150, filter: 'agTextColumnFilter',
      valueFormatter: p => p.value ?? '—' }
  ], [])

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    minWidth: 110,
    flex: 1
  }), [])

  const onGridReady = useCallback((params) => {
    const state = window.localStorage.getItem('columnState')
    if (state) {
      try {
        params.columnApi.applyColumnState({ state: JSON.parse(state), applyOrder: true })
      } catch {}
    }
  }, [])

  const handleQuick = (e) => {
    const v = e.target.value
    setQuick(v)
    if (gridRef.current?.api) {
      gridRef.current.api.setQuickFilter(v)
    }
  }

  const applyFilterModels = useCallback(() => {
    if (!gridRef.current?.api) return
    const fm = {}
    if (department !== 'all') fm['department'] = { filterType: 'text', type: 'equals', filter: department }
    if (location !== 'all') fm['location'] = { filterType: 'text', type: 'equals', filter: location }
    if (status !== 'all') fm['Status'] = { filterType: 'text', type: 'equals', filter: status === 'active' ? 'Active' : 'Inactive' }
    gridRef.current.api.setFilterModel(fm)
  }, [department, location, status])

  useEffect(() => { applyFilterModels() }, [applyFilterModels])

  const clearFilters = () => {
    setDepartment('all'); setLocation('all'); setStatus('all'); setQuick('')
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null)
      gridRef.current.api.setQuickFilter('')
    }
  }

  const exportCsv = () => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({ fileName: 'employees.csv' })
    }
  }

  const autoSizeAll = () => {
    if (gridRef.current?.columnApi) {
      const allCols = gridRef.current.columnApi.getColumns() || []
      gridRef.current.columnApi.autoSizeColumns(allCols, false)
    }
  }

  const saveLayout = () => {
    if (gridRef.current?.columnApi) {
      const state = gridRef.current.columnApi.getColumnState()
      window.localStorage.setItem('columnState', JSON.stringify(state))
    }
  }

  const resetLayout = () => {
    if (gridRef.current?.columnApi) {
      gridRef.current.columnApi.resetColumnState()
    }
    window.localStorage.removeItem('columnState')
  }

  const toggleDensity = () => {
    if (gridRef.current?.api) {
      const api = gridRef.current.api
      const current = api.getGridOption('rowHeight') || 42
      const next = current > 42 ? 42 : 60
      api.setGridOption('rowHeight', next)
      api.onRowHeightChanged()
    }
  }

  const containerClass = `ag-theme-quartz${themeDark ? '-dark' : ''}`

  return (
    <div className="grid-page">
      <section className="stats-row">
        <StatCard label="Total Employees" value={rowData.length} />
        <StatCard label="Avg Salary" value={avgSalary.toLocaleString(undefined, {style:'currency', currency:'USD', maximumFractionDigits:0})} />
        <StatCard label="Avg Performance" value={`${avgPerf} / 5`} hint="Performance rating out of 5" />
      </section>

      <section className="toolbar">
        <div className="left">
          <input
            type="search"
            value={quick}
            onChange={handleQuick}
            placeholder="Quick search (name, email, position...)"
            className="search"
          />
          <select value={department} onChange={e=>setDepartment(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>)}
          </select>
          <select value={location} onChange={e=>setLocation(e.target.value)}>
            {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'All locations' : l}</option>)}
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="right">
          <button onClick={clearFilters} title="Clear filters">Clear</button>
          <button onClick={exportCsv} title="Export CSV">Export CSV</button>
          <button onClick={autoSizeAll} title="Auto-size columns">Auto-size</button>
          <button onClick={saveLayout} title="Save column layout">Save Layout</button>
          <button onClick={resetLayout} title="Reset column layout">Reset Layout</button>
          <button onClick={toggleDensity} title="Toggle row density">Density</button>
          <button onClick={()=>setThemeDark(v=>!v)} title="Toggle theme">Theme</button>
        </div>
      </section>

      <div className={`grid-wrapper ${containerClass}`}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          pagination={true}
          paginationAutoPageSize={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  )
}
