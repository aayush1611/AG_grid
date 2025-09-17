import React from 'react'

export default function GridToolbar({
  quick,
  onQuickChange,
  department,
  onDepartmentChange,
  departments,
  location,
  onLocationChange,
  locations,
  status,
  onStatusChange,
  onClearFilters,
  onExportCsv,
  onAutoSize,
  onSaveLayout,
  onResetLayout,
  onToggleDensity,
  onToggleTheme
}) {
  return (
    <section className="toolbar">
      <div className="left">
        <input
          type="search"
          value={quick}
          onChange={onQuickChange}
          placeholder="Quick search (name, email, position...)"
          className="search"
        />
        <select value={department} onChange={onDepartmentChange}>
          {departments.map(d => (
            <option key={d} value={d}>
              {d === 'all' ? 'All departments' : d}
            </option>
          ))}
        </select>
        <select value={location} onChange={onLocationChange}>
          {locations.map(l => (
            <option key={l} value={l}>
              {l === 'all' ? 'All locations' : l}
            </option>
          ))}
        </select>
        <select value={status} onChange={onStatusChange}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="right">
        <button onClick={onClearFilters} title="Clear filters">Clear</button>
        <button onClick={onExportCsv} title="Export CSV">Export CSV</button>
        <button onClick={onAutoSize} title="Auto-size columns">Auto-size</button>
        <button onClick={onSaveLayout} title="Save column layout">Save Layout</button>
        <button onClick={onResetLayout} title="Reset column layout">Reset Layout</button>
        <button onClick={onToggleDensity} title="Toggle row density">Density</button>
        <button onClick={onToggleTheme} title="Toggle theme">Theme</button>
      </div>
    </section>
  )
} 