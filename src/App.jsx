import React from 'react'
import EmployeeGrid from './components/EmployeeGrid.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo">🧩</span>
          <h1>People Ops Dashboard</h1>
        </div>
        <p className="subtitle">AG Grid Community • Vite • React</p>
      </header>
      <main className="content">
        <EmployeeGrid />
      </main>
      <footer className="app-footer">
        <span>Built with AG Grid Community and Vite</span>
      </footer>
    </div>
  )
}
