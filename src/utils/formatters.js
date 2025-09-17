export const currencyFormatter = (params) => {
  return params.value != null 
    ? params.value.toLocaleString(undefined, {
        style: 'currency', 
        currency: 'USD', 
        maximumFractionDigits: 0
      }) 
    : '—'
}

export const dateValueFormatter = (params) => {
  if (!params.value) return '—'
  const d = new Date(params.value)
  if (Number.isNaN(d.getTime())) return params.value
  return d.toLocaleDateString(undefined, {
    year: 'numeric', 
    month: 'short', 
    day: '2-digit'
  })
}

export const formatCurrency = (value) => {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
} 