import { currencyFormatter, dateValueFormatter } from '../utils/formatters'
import { 
  PerformanceRenderer, 
  SkillsRenderer, 
  EmailRenderer, 
  activeValueGetter 
} from '../components/cellRenderers'

export const getColumnDefs = () => [
  { 
    headerName: 'ID', 
    field: 'id', 
    width: 90, 
    filter: 'agNumberColumnFilter', 
    pinned: 'left' 
  },
  { 
    headerName: 'Name', 
    valueGetter: params => `${params.data.firstName} ${params.data.lastName}`, 
    minWidth: 160, 
    flex: 1, 
    filter: 'agTextColumnFilter' 
  },
  { 
    headerName: 'Email', 
    field: 'email', 
    cellRenderer: EmailRenderer, 
    minWidth: 220, 
    filter: 'agTextColumnFilter' 
  },
  { 
    headerName: 'Department', 
    field: 'department', 
    minWidth: 140, 
    filter: 'agTextColumnFilter' 
  },
  { 
    headerName: 'Position', 
    field: 'position', 
    minWidth: 160, 
    filter: 'agTextColumnFilter' 
  },
  { 
    headerName: 'Location', 
    field: 'location', 
    minWidth: 130, 
    filter: 'agTextColumnFilter' 
  },
  { 
    headerName: 'Salary', 
    field: 'salary', 
    valueFormatter: currencyFormatter, 
    minWidth: 140, 
    filter: 'agNumberColumnFilter' 
  },
  { 
    headerName: 'Hire Date', 
    field: 'hireDate', 
    valueFormatter: dateValueFormatter, 
    filter: 'agDateColumnFilter',
    filterParams: {
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const cellDate = new Date(cellValue)
        if (cellDate < filterLocalDateAtMidnight) return -1
        if (cellDate > filterLocalDateAtMidnight) return 1
        return 0
      }
    }
  },
  { 
    headerName: 'Age', 
    field: 'age', 
    width: 110, 
    filter: 'agNumberColumnFilter' 
  },
  { 
    headerName: 'Perf.', 
    field: 'performanceRating', 
    width: 130, 
    filter: 'agNumberColumnFilter', 
    cellRenderer: PerformanceRenderer 
  },
  { 
    headerName: 'Projects', 
    field: 'projectsCompleted', 
    width: 120, 
    filter: 'agNumberColumnFilter' 
  },
  { 
    headerName: 'Status', 
    valueGetter: activeValueGetter, 
    width: 120, 
    filter: 'agTextColumnFilter',
    cellClass: params => (params.data?.isActive ? 'ok' : 'warn') 
  },
  { 
    headerName: 'Skills', 
    field: 'skills', 
    minWidth: 250, 
    filter: false, 
    cellRenderer: SkillsRenderer 
  },
  { 
    headerName: 'Manager', 
    field: 'manager', 
    minWidth: 150, 
    filter: 'agTextColumnFilter',
    valueFormatter: params => params.value ?? '—' 
  }
]

export const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
  minWidth: 110,
  flex: 1
} 