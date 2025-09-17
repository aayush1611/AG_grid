import React from 'react'

export const PerformanceRenderer = (params) => {
  const value = Number(params.value || 0)
  const percentage = Math.round((value / 5) * 100)
  
  return (
    <div className="perf-wrap" title={`${value} / 5`}>
      <div className="perf-bar">
        <span style={{ width: percentage + '%' }} />
      </div>
      <span className="perf-text">{value}</span>
    </div>
  )
}

export const SkillsRenderer = (params) => {
  const skills = params.value || []
  return (
    <div className="chip-row">
      {skills.map((skill, index) => (
        <span className="chip" key={index}>{skill}</span>
      ))}
    </div>
  )
}

export const EmailRenderer = (params) => {
  const email = params.value
  return email ? (
    <a href={`mailto:${email}`} className="link">{email}</a>
  ) : '—'
}

export const activeValueGetter = (params) => {
  return params.data?.isActive ? 'Active' : 'Inactive'
} 