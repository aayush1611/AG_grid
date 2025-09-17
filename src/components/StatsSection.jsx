import React from 'react'
import StatCard from './StatCard'
import { formatCurrency } from '../utils/formatters'

export default function StatsSection({ rowData, avgSalary, avgPerf }) {
  return (
    <section className="stats-row">
      <StatCard label="Total Employees" value={rowData.length} />
      <StatCard 
        label="Avg Salary" 
        value={formatCurrency(avgSalary)} 
      />
      <StatCard 
        label="Avg Performance" 
        value={`${avgPerf} / 5`} 
        hint="Performance rating out of 5" 
      />
    </section>
  )
} 