export const calculateStats = (rowData) => {
  if (!rowData.length) return { avgSalary: 0, avgPerf: 0 }
  
  const totalSalary = rowData.reduce((acc, row) => acc + (row.salary || 0), 0)
  const totalPerf = rowData.reduce((acc, row) => acc + (row.performanceRating || 0), 0)
  
  return {
    avgSalary: Math.round(totalSalary / rowData.length),
    avgPerf: (totalPerf / rowData.length).toFixed(2)
  }
}

export const getUniqueValues = (data, field) => {
  return ['all', ...Array.from(new Set(data.map(row => row[field])))]
} 